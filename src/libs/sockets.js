const { Room, User, Message } = require('../libs/ChatDatabase');

const DEFAULT_AVATAR = '/default/avatar-default.png';
const DEFAULT_PAGE_COVER = '/default/front-default.png';
const ERR_USER_DELETED = 'error, user deleted';
const ERR_MESSAGE_DELETED = 'Error, message deleted';
const MAX_LOAD_MESSAGE = 20;

const ChatSocketIO = (server, sessionMiddleware) => {
    const io = require('socket.io')(server);
    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    io.sockets.on('connection', socket => {
        socket.on('charge my rooms', async () => {
            const user = socket.request.session.user;
            let myRooms = [];

            for (const id of user.myRooms) {
                await Room.findById(id, (err, room) => {
                    if (room) {
                        myRooms.push({
                            _id: room._id,
                            name: room.name,
                            coverUrl: room.coverUrl ? room.coverUrl : DEFAULT_PAGE_COVER,
                            lastMessage: {
                                message: room.lastMessage.message,
                                sender: room.lastMessage.sender,
                                date: room.lastMessage.date
                            }
                        });
                    }
                });
            }

            io.to(socket.id).emit('load my rooms', myRooms);
        });

        socket.on('charge favorite rooms', async () => {
            const user = socket.request.session.user;
            let favoriteRooms = [];

            for (const id of user.favoriteRooms) {
                await Room.findById(id, (err, room) => {
                    if (room) {
                        favoriteRooms.push({
                            _id: room._id,
                            name: room.name,
                            coverUrl: room.coverUrl ? room.coverUrl : DEFAULT_PAGE_COVER,
                            lastMessage: {
                                message: room.lastMessage.message,
                                sender: room.lastMessage.sender,
                                date: room.lastMessage.date
                            }
                        });
                    }
                });
            }

            io.to(socket.id).emit('load favorite rooms', favoriteRooms);
        });

        if (socket.request.session.room) {
            const roomId = socket.request.session.room._id;
            const user = socket.request.session.user;
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
                    _senderId: user._id,
                    msg: msg
                });
                message.save((err, msg) => {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    Room.findById(roomId, (err, room) => {
                        if (err) {
                            console.error(err);
                        } else {
                            room.setLastMessage({
                                message: msg.msg,
                                sender: user.name,
                                date: msg.date.toLocaleString()
                            });
                        }
                    });

                    io.to(roomId).emit('load new message', {
                        sender: {
                            name: user.name,
                            avatarUrl: user.avatarUrl ? user.avatarUrl : DEFAULT_AVATAR
                        },
                        date: msg.date,
                        msg: msg.msg
                    });
                });
            });

            console.log(`User: ${user._id} join to room: ${roomId}`);
        }
    });
};

const loadMessageData = async messages => {
    let messagesData = [];
    for (const message of messages) {
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