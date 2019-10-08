const {Schema} = require('mongoose');

const MessageShema = new Schema({
    msg: String,
    sender: {
        _id: Schema.Types.ObjectId,
        name: String
    },
    addressee: {
        _id: Schema.Types.ObjectId,
        name: String
    },
    date: Date.now
});

module.exports = MessageShema;