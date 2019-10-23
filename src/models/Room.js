const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { ObjectId } = require('mongoose').mongo;

const ERR_ROOM_ALREADY_EXIST = 'Room already exists';
const ERR_ROOM_DOES_NOT_EXIST = 'The room does not exist.';

const RoomSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: ObjectId
    },
    name: {
        type: String,
        default: `Room-${Date.now}`
    },
    adminId: {
        type: Schema.Types.ObjectId,
        set: ObjectId
    },
    lastMessage: {
        message: String,
        sender: String,
        date: String
    },
    description: String,
    coverUrl: String,
    date: {
        type: Date,
        default: Date.now
    }
});

// STATIC

RoomSchema.statics.findRoomByName = function (name, cb) {
    this.findOne({ name: name }, cb);
}

RoomSchema.statics.findRoomById = async function (id) {
    try {
        const room = await this.findById(id);
        if (room)
            return room;
        else
            throw { message: ERR_ROOM_DOES_NOT_EXIST };
    } catch (err) {
        throw err.message;
    }
};

RoomSchema.statics.loadRooms = async function (sortOpc, min, max) {
    try {
        const rooms = await this.find()
            .skip(min)
            .limit(max)
            .sort(sortOpc)
            .exec();
        return rooms;
    } catch (err) {
        throw err.message;
    }
};
/*
RoomSchema.statics.saveRoom = function (room, cb) {
    this.findRoomByName(room.name, (err, oldRoom) => {
        if (oldRoom) {
            cb(ERR_ROOM_ALREADY_EXIST, null);
        } else if (err) {
            cb(err, null);
        } else {
            room.save(cb);
        }
    });
}
*/

RoomSchema.statics.saveRoom = async function (room) {
    try {
        const oldRoom = await this.findOne({ name: room.name });
        if (!oldRoom)
            return room.save();
        else
            throw { message: ERR_ROOM_ALREADY_EXIST };
    } catch (err) {
        throw err.message;
    }
};

// METHODS

RoomSchema.methods.addUser = function (user) {
    const userData = {
        _id: user._id,
        name: user.name,
        avatarUrl: user.avatarUrl
    };
    if (!this.members.includes(userData)) {
        this.members.push(userData);
        return this.save();
    } else {
        return new Error('user already exists.');
    }
};

RoomSchema.methods.removeUser = function (user) {
    const userData = {
        _id: user._id,
        name: user.name,
        avatarUrl: user.avatarUrl
    };
    const members = this.members.filter(member => member._id != user._id);
    this.members = members;
    return this.save();
};

RoomSchema.methods.setImgUrl = function (imgUrl) {
    this.imgUrl = imgUrl;
    return this.save();
};

RoomSchema.methods.setAdmin = function (user) {
    const userData = {
        _id: user._id,
        name: user.name,
        avatarUrl: user.avatarUrl
    };
    this.admin = userData;
    return this.save();
};

RoomSchema.methods.setDescription = function (description) {
    this.description = description;
    return this.save();
};

RoomSchema.methods.setLastMessage = function (message) {
    this.lastMessage = message;
    return this.save();
};

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;