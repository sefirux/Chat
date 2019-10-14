const saltRounds = 10;
const bcrypt = require('bcrypt');
const validator = require('validator');
const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const { ObjectId } = require('mongoose').mongo;

const ERR_USER_LOGIN = 'This user does not exist or incorrect password';
const ERR_USER_DOESNT_EXIST = 'This user does not exist.';
const ERR_USER_ALREADY_EXIST = 'User already exists';

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
    myRooms: [{
        type: Schema.Types.ObjectId
    }],
    favoriteRooms: [{
        type: Schema.Types.ObjectId
    }],
    avatarUrl: String,
    coverUrl: String
});

// STATIC

UserSchema.statics.findUser = function (email, password, cb) {
    this.findUserByEmail(email, (err, user) => {
        if (user && user.passwordCompare(password)) {
            cb(null, user);
        } else {
            cb(ERR_USER_LOGIN, null);
        }
    });
};

UserSchema.statics.findUserById = function (id, cb) {
    this.findOne({ _id: id }, (err, user) => {
        if (user) {
            cb(null, user);
        } else {
            cb(ERR_USER_DOESNT_EXIST, null);
        }
    });
};

UserSchema.statics.findUserByEmail = function (email, cb) {
    this.findOne({ email: email }, (err, user) => {
        if (user) {
            cb(null, user);
        } else {
            cb(ERR_USER_DOESNT_EXIST, null);
        }
    });
};

UserSchema.statics.findUsersByName = function (name, cb) {
    this.find({ name: name }, (err, user) => {
        if (!user.length) {
            cb(null, user);
        } else {
            cb(ERR_USER_DOESNT_EXIST, null);
        }
    });
};

UserSchema.statics.saveUser = function (user, cb) {
    this.findUserByEmail(user.email, (err, oldUser) => {
        if (oldUser) {
            cb(ERR_USER_ALREADY_EXIST, null);
        } else {
            user.save(cb);
        }
    });
};

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

UserSchema.methods.passwordCompare = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.setAvatarUrl = function (avatarUrl) {
    this.avatarUrl = avatarUrl;
    return this.save();
};

UserSchema.methods.addRoom = function (id) {
    if(!this.myRooms.includes(id)){
        this.myRooms.push(new ObjectId(id));
        return this.save();
    }
};

UserSchema.methods.addFavoriteRoom = function (id) {
    if(!this.favoriteRooms.includes(id)){
        this.favoriteRooms.push(ObjectId(id));
        return this.save();
    }
};

function encrypt(string) {
    return bcrypt.hashSync(string, saltRounds);
}

const User = mongoose.model('User', UserSchema);

module.exports = User;