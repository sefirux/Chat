const {
    Message
} = require('../libs/ChatDatabase');

const MAX_SEARCH_USERS = 10;
const MAX_LOAD_MESSAGE = 20;

const ChatSocketIO = (server, sessionMiddleware) => {
    const io = require('socket.io')(server);
    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.sockets.on('connection', socket => {
        if (socket.request.session.roomData) {
            const roomId = socket.request.session.roomData.id;
            const userData = socket.request.session.userData;

            socket.join(roomId);

            loadMessages(roomId, (err, messages) => {
                if (err) {
                    console.log(err)
                } else {
                    let oldMessages = [];

                    messages.forEach(message => {
                        oldMessages.push({
                            sender: message.sender.name,
                            date: message.date,
                            msg: message.msg
                        });
                    });
                    
                    io.sockets.to(roomId).emit('load old messages', oldMessages);
                }
            });

            socket.to(roomId).on('send message', msg => {
                const message = new Message({
                    _roomId: roomId,
                    sender: {
                        _id: userData.id,
                        name: userData.name
                    },
                    msg: msg
                });
                message.save((err, msg) => {
                    if (err) {
                        console.error(err);
                    } else {
                        io.sockets.to(roomId).emit('load new message', {
                            sender: msg.sender.name,
                            date: msg.date,
                            msg: msg.msg
                        });
                    }
                });
            });
            console.log(`User: ${userData.id} join to room: ${roomId}`);
        }
    });
};

const loadMessages = (roomId, cb) => {
    Message.find({
            _roomId: roomId
        })
        .limit(MAX_LOAD_MESSAGE)
        .sort({
            date: -1
        })
        .exec(cb);
}

module.exports = ChatSocketIO;