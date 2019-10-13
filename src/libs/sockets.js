const { User, Message } = require('../libs/ChatDatabase');

const DEFAULT_AVATAR = '/default/avatar-default.png';
const ERR_USER_DELETED = 'error, user deleted';
const ERR_MESSAGE_DELETED = 'Error, message deleted';
const MAX_LOAD_MESSAGE = 20;

const ChatSocketIO = (server, sessionMiddleware) => {
    const io = require('socket.io')(server);
    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.sockets.on('connection', socket => {
        if (!socket.request.session.roomData) return;

        const roomId = socket.request.session.roomData.id;
        const userData = socket.request.session.userData;
        let countMSG = 0;

        socket.join(roomId);

        socket.to(roomId).on('old messages', () => {
            Message.countDocuments({ _roomId: roomId }, (err, count) => {
                if (err) return console.error(err);

                Message.loadMessages(roomId, countMSG, MAX_LOAD_MESSAGE, async (err, messages) => {
                    if (err) return console.error(err);

                    countMSG += MAX_LOAD_MESSAGE;

                    let messagesData = await loadMessageData(messages);
                    
                    io.to(socket.id).emit('load old messages', {
                        messages: messagesData,
                        messagesToLoad: countMSG < count
                    });
                });
            });
        });

        socket.to(roomId).on('send message', msg => {
            const message = new Message({
                _roomId: roomId,
                _senderId: userData.id,
                msg: msg
            });
            message.save((err, msg) => {
                if (err) {
                    console.error(err);
                } else {
                    io.to(roomId).emit('load new message', {
                        sender: {
                            name: userData.name,
                            avatarUrl: userData.avatarUrl ? userData.avatarUrl : DEFAULT_AVATAR
                        },
                        date: msg.date,
                        msg: msg.msg
                    });
                }
            });
        });
        console.log(`User: ${userData.id} join to room: ${roomId}`);
    });
};

const loadMessageData = async messages => {
    let messagesData = [];
    for(const message of messages){
        await User.findById(message._senderId, (err, user) => {
            let oldMessage = {
                sender: {
                    name: user ? user.name : ERR_USER_DELETED,
                    avatarUrl: user.avatarUrl ? user.avatarUrl : DEFAULT_AVATAR
                },
                date: message.date,
                msg: message.msg ? message.msg : ERR_MESSAGE_DELETED
            };
            messagesData.push(oldMessage);
        }); 
    }
    return messagesData;
}

module.exports = ChatSocketIO;