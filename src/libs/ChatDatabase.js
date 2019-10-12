const mongoose = require('mongoose');

const Message = require('../models/Message');
const Room = require('../models/Room');
const User = require('../models/User');

const dbPort = 27017;
const dbName = 'roomdb';
const dbURI = `mongodb://localhost:${dbPort}/${dbName}`;
const dbConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
};

mongoose.connect(dbURI, dbConfig)
    .then(res => console.log(`Successfuly connected: ${dbURI}`))
    .catch(err => console.log(err));

module.exports = { Message, Room, User };