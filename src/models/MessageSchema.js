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
    msg: String,
    sender: {
        type: {
            _id: Schema.Types.ObjectId,
            name: String
        },
        required: true
    },
    addressee: {
        _id: Schema.Types.ObjectId,
        name: {
            type: String,
            default: function () {
                return 'Yo';
            }
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// STATICS

MessageShema.statics.loadMessages = function (roomId, min, max, cb) {
    this.find({ _roomId: roomId })
        .skip(min)
        .limit(max)
        .sort({ date: -1 })
        .exec(cb);
}

module.exports = MessageShema;