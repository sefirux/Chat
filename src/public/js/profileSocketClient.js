const socket = io();

document.addEventListener('DOMContentLoaded', event => {
    const favoriteRooms = document.querySelector('#favorite-rooms');
    const myRooms = document.querySelector('#my-rooms');

    socket.on('load favorite rooms', rooms => {
        favoriteRooms.innerHTML = '';
        rooms.forEach(room => {
            const node = createRoomNode(room);
            favoriteRooms.appendChild(node);
        });
    });

    socket.on('load my rooms', rooms => {
        myRooms.innerHTML = '';
        rooms.forEach(room => {
            const node = createRoomNode(room);
            myRooms.appendChild(node);
        });
    });

    socket.emit('charge favorite rooms');
    socket.emit('charge my rooms');
});

const createRoomNode = room => {
    const node = document.createElement('li');
    node.classList.add('collection-item', 'avatar');
    node.innerHTML = `
    <a href="/room/id/${room._id}"><img src="${room.coverUrl}" alt="" class="circle"></a>
    <span class="title"><strong>${room.name}</strong></span><br/>
    <span>${room.lastMessage.sender}: </span>
    <span>${room.lastMessage.message}</span><br/>
    <span class="right"small>${new Date(room.lastMessage.date).toLocaleString()}</small></span><br/>
`;
    return node;
};