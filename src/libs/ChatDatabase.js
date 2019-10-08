const mongoose = require('mongoose');

const MessagSchema = require('../models/MessageSchema');
const RoomSchema = require('../models/RoomSchema');
const UserSchema = require('../models/UserSchema');

const Message = mongoose.model('Message', MessagSchema);
const Room = mongoose.model('Room', RoomSchema);
const User = mongoose.model('User', UserSchema);

const dbPort = 27017;
const dbName = 'roomdb';
const dbURI = `mongodb://localhost:${dbPort}/${dbName}`;
const dbConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
};

mongoose.connect(dbURI,dbConfig)
    .then(res => console.log(`Successfuly connected: ${dbURI}`))
    .catch(err => console.error(err));

module.exports = {Message, Room, User};