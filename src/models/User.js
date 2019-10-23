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

UserSchema.statics.findUserByEmailAndPassword = async function (email, password) {
    try {
        const user = await this.findOne({ email: email });
        if (user && user.passwordCompare(password))
            return user;
        else
            throw { message: ERR_USER_LOGIN };
    } catch (err) {
        throw err.message;
    }
};

UserSchema.statics.findUserById = async function (id) {
    try {
        const user = await this.findById(id);
        if (user)
            return user;
        else
            throw { message: ERR_USER_DOESNT_EXIST };
    } catch (err) {
        throw err.message;
    }
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

UserSchema.statics.saveUser = async function (user) {
    try{
        const oldUser = await this.findOne({ email: user.email });
        if(!oldUser)
            return user.save();
        else
            throw { message: ERR_USER_ALREADY_EXIST };
    } catch (err) {
        throw err.message;
    }
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
    if (!this.myRooms.includes(id)) {
        this.myRooms.push(new ObjectId(id));
        return this.save();
    }
};

UserSchema.methods.addFavoriteRoom = function (id) {
    if (!this.favoriteRooms.includes(id)) {
        this.favoriteRooms.push(ObjectId(id));
        return this.save();
    }
};

function encrypt(string) {
    return bcrypt.hashSync(string, saltRounds);
}

const User = mongoose.model('User', UserSchema);

module.exports = User;