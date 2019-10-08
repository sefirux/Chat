const {Schema} = require('mongoose');

const RoomSchema = new Schema({
    _id: Schema.Types.ObjectId,
    admin: {
        _id: Schema.Types.ObjectId,
        name: String
    },
    members: [{
        _id: Schema.Types.ObjectId,
        avatarUrl: String,
        name: String
    }],
    description: String,
    imgUrl: String,
    messages: Array,
});

RoomSchema.methods.from = data => {
    this.admin = data.admin;
    data.members.forEach(member => {
        if (!this.members.include(member)) {
            this.members.push(member);
        }
    });
    this.description = data.description;
    this.imgUrl = data.description;
    this.messages = data.messages;
}

RoomSchema.methods.setImgUrl = url =>{
    this.imgUrl = url;
};

module.exports = RoomSchema;