document.addEventListener('DOMContentLoaded', e => {
    const socket = io();
    const userList = document.querySelector('#users-list');
    const chipsAutoComplete = M.Chips.init(userList, {
        placeholder: 'Enter users name',
        name: 'Users',
        autocompleteOptions: {
            data: {'Apple': null, 'Microsoft': null, 'Google': null},
            limit: 5,
            minLength: 1
        }
    });
    socket.on('user search completed', data => {
        chipsAutoComplete.options.autocompleteOptions.data[data.name] = null;
    });
    userList.addEventListener('input', event => {
        socket.emit('search users', {regex: 'e'});
    });
});