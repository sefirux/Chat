const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { ObjectId } = require('mongoose').mongo;

const ERR_ROOM_ALREADY_EXIST = 'Room already exists';

const RoomSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: ObjectId
    },
    name: {
        type: String,
        default: `Room-${Date.now}`
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
    date: {
        type: Date,
        default: Date.now
    }
});

// STATIC

RoomSchema.statics.findRoomByName = function (name, cb) {
    this.findOne({ name: name }, cb);
}

RoomSchema.statics.loadRooms = function (sortOpc, min, max, cb) {
    this.find()
        .skip(min)
        .limit(max)
        .sort(sortOpc)
        .exec(cb);
}

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

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;