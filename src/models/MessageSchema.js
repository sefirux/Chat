const { Schema } = require('mongoose');
const { ObjectId } = require('mongoose').mongo;

const MessageShema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: ObjectId
    },
    msg: String,
    sender: {
        _id: Schema.Types.ObjectId,
        name: String
    },
    addressee: {
        _id: Schema.Types.ObjectId,
        name: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = MessageShema;