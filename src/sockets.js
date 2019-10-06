const chatdb = require('./chatdb');
const Message = require('./models/Message');

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

            socket.join(roomId);

            chatdb.findRoomById(roomId, (err, room) => {
                if (room) {
                    room.messages.forEach( message => {
                        io.sockets.to(roomId).emit('update room', message);
                    });
                }
            });

            socket.to(roomId).on('send message', msg => {
                if (msg.length > 0) {
                    const message = new Message(msg, socket.request.session.userData);
                    chatdb.addMesaggeToRoom(message, roomId, (err, res) => {
                        if (res) {
                            console.log(res);
                            io.sockets.to(roomId).emit('update room', res);
                        } else {
                            console.error(err);
                        }
                    })
                }
            });
            console.log(`User join to room; id: ${roomId}`);
        }


        socket.on('search users', data => {
            chatdb.findUsersByNameRegex(data, MAX_SEARCH_USERS, (err, users) => {
                users.forEach(user => {
                    socket.emit('user search completed', {
                        _id: user._id,
                        name: user.name,
                        email: user.email
                    });
                })
            })
        });

        socket.on('add user to room', data => {
            chatdb.findUserById(data.userId, (err, user) => {
                if (user) {
                    chatdb.findRoom(data.roomId, (err, room) => {
                        if (room) {
                            if (!room.membersId.include(user._id)) {
                                room.membersId.push(user._id);
                                chatdb.updateRoom({
                                    _id: room._id
                                }, room, (err, res) => {
                                    if (res) {
                                        chatdb.updateUser({
                                            _id: user._id
                                        }, user, (err, res) => {
                                            if (res) {
                                                console.log(`User ${user.name} added to ${room.name} room.`);
                                            }
                                        })
                                    }
                                });
                            }
                        }
                    });
                }
            });
        });
    });
};

module.exports = ChatSocketIO;