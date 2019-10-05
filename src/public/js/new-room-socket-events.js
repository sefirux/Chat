let usersData = {};
let membersId = [];

document.addEventListener('DOMContentLoaded', e => {
    const socket = io();
    const newRoomForm = document.querySelector('#new-room-form');
    const userList = document.querySelector('#users-list');
    const chipsAutoComplete = M.Chips.init(userList, {
        placeholder: 'Enter users name',
        name: 'Users',
        autocompleteOptions: {
            data: {},
            limit: 5,
            minLength: 1
        }
    });
    socket.on('user search completed', data => {
        usersData[data.name] = data;
        chipsAutoComplete.options.autocompleteOptions.data[data.name] = null;
    });
    userList.addEventListener('input', event => {
        socket.emit('search users', {
            regex: event.srcElement.value
        });
    });
    newRoomForm.addEventListener('submit', event => {
        const roomName = document.querySelector('#new-room-name').value;
        chipsAutoComplete.chipsData.forEach(chip => {
            if (!membersId.includes(usersData[chip.tag]._id)) {
                membersId.push(usersData[chip.tag]._id);
            }
        });

        const newRoomData = {
            name: roomName,
            membersId: membersId
        };
        newRoomForm.elements["room"] = newRoomData;
        console.log(newRoomForm);
        /*fetch('/room/new', {
                method: 'POST',
                body: JSON.stringify(newRoomData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => res.json())
            .catch(err => console.log(`Error: ${err}`))
            .then(res => console.log(`Success: ${res}`));
            */
    });
});