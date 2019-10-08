const { Schema } = require('mongoose');
const { ObjectId } = require('mongoose').mongo;
const validator = require('validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const UserSchema = new Schema({
    _id: {
        type: Schema.Types.ObjectId,
        default: ObjectId
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: validator.isEmail
        }
    },
    password: {
        type: String,
        set: encrypt,
        required: true
    },
    avatarUrl: String
});

// STATIC

UserSchema.statics.findUserById = async function(id){
    return await this.findOne({_id: new ObjectId(id)});
}

UserSchema.statics.findUserByEmail = async function(email){
    return await this.findOne({email: email});
}

UserSchema.statics.findUsersByName = async function(name){
    return await this.find({name: name});
}

// METHODS

UserSchema.methods.setName = function (name) {
    this.name = name;
    return this.save();
};

UserSchema.methods.setEmail = function (email) {
    this.email = email;
    return this.save();
};

UserSchema.methods.setPassword = function (password) {
    this.password = password;
    return this.save();
};

UserSchema.methods.compPass = function (password) {
    return bcrypt.compareSync(password, this.password);
}

UserSchema.methods.setAvatarUrl = function (avatarUrl) {
    this.avatarUrl = avatarUrl;
    return this.save();
};

function encrypt(string) {
    return bcrypt.hashSync(string, saltRounds);
}

module.exports = UserSchema;