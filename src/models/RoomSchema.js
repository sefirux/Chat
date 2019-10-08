const { Schema } = require('mongoose');
const { ObjectId } = require('mongoose').mongo;

const RoomSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: ObjectId
    },
    admin: {
        type: {
            _id: Schema.Types.ObjectId,
            name: String
        },
        required: true
    },
    members: {
        type: [{
            _id: Schema.Types.ObjectId,
            name: String,
            avatarUrl: String
        }],
        default: []
    },
    description: String,
    imgUrl: String,
    messages: {
        type: [Schema.Types.ObjectId],
        default: []
    }
});

// STATIC

RoomSchema.statics.findRoomById = async function(id){
    return await this.findOne({_id: new ObjectId(id)});
}

RoomSchema.statics.findRoomByName = async function(name){
    return await this.find({name: name});
}

// METHODS

RoomSchema.methods.addUser = function(user) {
    const userData = {
        _id: user._id,
        name: user.name,
        avatarUrl: user.avatarUrl
    };
    if(!this.members.includes(userData)){
        this.members.push(userData);
        return this.save();
    } else {
        return new Error('user already exists.');
    }
};

RoomSchema.methods.removeUser = function(user) {
    const userData = {
        _id: user._id,
        name: user.name,
        avatarUrl: user.avatarUrl
    };
    const members = this.members.filter(member => member._id != user._id);
    this.members = members;
    return this.save();
};

RoomSchema.methods.addMessage = function(message) {
    this.messages.push(message._id);
    return this.save();
};

RoomSchema.methods.removeMessage = function(message) {
    const messages = this.messages.filter(message => message._id != message._id);
    this.messages = messages;
    return this.save();
};

RoomSchema.methods.setImgUrl = function(imgUrl){
    this.imgUrl = imgUrl;
    return this.save();
};

RoomSchema.methods.setAdmin = function(user) {
    const userData = {
        _id: user._id,
        name: user.name,
        avatarUrl: user.avatarUrl
    };
    this.admin = userData;
    return this.save();
};

RoomSchema.methods.setDescription = function(description){
    this.description = description;
    return this.save();
};

module.exports = RoomSchema;