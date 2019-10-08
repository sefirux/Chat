const {Schema} = require('mongoose');

const UserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    avatarUrl: String
});

module.exports = UserSchema;