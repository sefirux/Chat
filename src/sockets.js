const chatdb = require('./chatdb');

const ChatSocketIO = (server, sessionMiddleware) => {
    const socketSession = require('socket.io')(server);
    socketSession.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    socketSession.sockets.on('connection', (socket) => {

        let msj = [];
        console.log(socket.request.session)
        console.log('Nuevo usuario conectado');

        msj.forEach(m => {
            socket.emit('recibir mensaje', m);
        });
        socket.on('enviar mensaje', data => {
            if (data.msj.length > 0) {
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

/*
module.exports = io => {
    let msj = [];
    io.on('connection', socket => {
        console.log('Nuevo usuario conectado');

        msj.forEach( m => {
            socket.emit('recibir mensaje', m);
        });

        socket.on('enviar mensaje', data => {
            if(data.msj.length > 0){
                msj.push(data);
                io.sockets.emit('recibir mensaje', data);
            }
        });
    });
};
*/