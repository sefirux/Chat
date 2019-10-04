const chatdb = require('./chatdb');
let msj = [];

const ChatSocketIO = (server, sessionMiddleware) => {
    const socketSession = require('socket.io')(server);
    socketSession.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    socketSession.sockets.on('connection', socket => {

        msj.forEach(m => {
            socket.emit('recibir mensaje', m);
        });

        socket.on('enviar mensaje', data => {
            if (data.msj.length > 0) {
                const userData = socket.request.session.userData;
                data.userData = {
                    name: userData.name,
                    email: userData.email
                }
                msj.push(data);
                socketSession.sockets.emit('recibir mensaje', data);
            }
        });
    });
    
    socketSession.sockets.on('enviar mensaje', data => {
        console.log(data);
    });
};

module.exports = ChatSocketIO;