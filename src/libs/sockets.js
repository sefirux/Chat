const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User');

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
                try {
                    const room = await Room.findById(id);
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
                } catch (err) {
                    console.error(err);
                }
            }

            io.to(socket.id).emit('load my rooms', myRooms);
        });

        socket.on('charge favorite rooms', async () => {
            const user = socket.request.session.user;
            let favoriteRooms = [];

            for (const id of user.favoriteRooms) {
                try {
                    const room = await Room.findById(id);
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
                } catch (err) {
                    console.error(err);
                }
            }

            io.to(socket.id).emit('load favorite rooms', favoriteRooms);
        });

        if (!socket.request.session.room)
            return;

        socket.room = socket.request.session.room;
        socket.user = socket.request.session.user;
        socket.request.session.room = null;
        let countMSG = 0;

        socket.join(socket.room._id);

        socket.to(socket.room._id).on('old messages', async () => {
            try {
                const data = await Message.loadMessages(socket.room._id, countMSG, MAX_LOAD_MESSAGE);
                const messagesData = await loadMessageData(data.messages);
                countMSG += MAX_LOAD_MESSAGE;
                
                io.to(socket.id).emit('load old messages', {
                    messages: messagesData,
                    messagesToLoad: countMSG < data.count
                });

            } catch (err) {
                console.error(err);
            }
        });

        socket.to(socket.room._id).on('send message', async msg => {
            const message = new Message({
                _roomId: socket.room._id,
                _senderId: socket.user._id,
                msg: msg
            });
            try {
                const result = await message.save();
                saveLastMessage(socket.room._id, result, socket.user.name);

                io.to(socket.room._id).emit('load new message', {
                    sender: {
                        name: socket.user.name,
                        avatarUrl: socket.user.avatarUrl ? socket.user.avatarUrl : DEFAULT_AVATAR
                    },
                    date: result.date,
                    msg: result.msg
                });
            } catch (err) {
                console.error(err);
            }
        });

        console.log(`User: ${socket.user._id} join to room: ${socket.room._id}`);
    });
};

const loadMessageData = async messages => {
    let messagesData = [];
    for (const message of messages) {
        try {
            const user = await User.findById(message._senderId);
            let oldMessage = {
                sender: {
                    name: user ? user.name : ERR_USER_DELETED,
                    avatarUrl: user.avatarUrl ? user.avatarUrl : DEFAULT_AVATAR
                },
                date: message.date,
                msg: message.msg ? message.msg : ERR_MESSAGE_DELETED
            };
            messagesData.push(oldMessage);
        } catch (err) {
            console.error(err);
        }
    }
    return messagesData;
};

const saveLastMessage = (roomId, message, senderName) => {
    Room.findById(roomId, (err, room) => {
        if (err) {
            console.error(err);
            return;
        }
        room.setLastMessage({
            message: message.msg,
            sender: senderName,
            date: message.date
        });
    });
};

module.exports = ChatSocketIO;