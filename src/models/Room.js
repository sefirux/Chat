class Room {
    constructor(data, adminId){
        this.name = data.name ? data.name : `Room-${(new Date).toString()}`;
        this.adminId = adminId ? adminId : null;
        this.membersId = data.membersId ? data.membersId : [];
        this.messages = [];
        if(this.adminId){
            this.membersId.push(this.adminId);
        }
    }
}

module.exports = Room;