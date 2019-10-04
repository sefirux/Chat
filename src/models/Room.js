class Room {
    constructor(data){
        this.name = data.name ? data.name : `Room-${(new Date).toString()}`;
        this.admin = data.admin ? data.admin : null;
        this.users = data.users ? data.users : null;
        this.messages = data.messages ? data.messages : null;
    }
}

module.exports = Room;