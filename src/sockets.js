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