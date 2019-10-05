class Room {
    constructor(data, admin){
        this.name = data.name ? data.name : `Room-${(new Date).toString()}`;
        this.admin = admin ? admin : null;
        this.usersId = data.usersId ? data.usersId : null;
        this.messages = null;
    }
}

module.exports = Room;