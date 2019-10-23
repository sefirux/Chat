const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { ObjectId } = require('mongoose').mongo;

const MessageShema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: ObjectId
    },
    _roomId: {
        type: Schema.Types.ObjectId,
        set: ObjectId,
        required: true
    },
    _senderId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    _addresseeId: {
        type: Schema.Types.ObjectId
    },
    date: {
        type: Date,
        default: Date.now
    },
    msg: String
});

// STATICS

MessageShema.statics.loadMessages = async function (roomId, min, max) {
    try {
        const count = await this.countDocuments({ _roomId: roomId });
        const messages = await this.find({ _roomId: roomId })
            .skip(min)
            .limit(max)
            .sort({ date: -1 });

        return { messages: messages, count: count };
    } catch (err) {
        throw err;
    }
}

const Message = mongoose.model('Message', MessageShema);

module.exports = Message;