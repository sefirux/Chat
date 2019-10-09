const { Schema } = require('mongoose');
const { ObjectId } = require('mongoose').mongo;
const validator = require('validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const ERR_USER_DOESNT_EXIST = 'This user does not exist or incorrect password';
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
    avatarUrl: String
});

// STATIC

UserSchema.statics.findUser = function (email, password, cb) {
    this.findUserByEmail(email, (err, user) => {
        if (user && user.passwordCompare(password)) {
            cb(null, user);
        } else {
            cb(ERR_USER_DOESNT_EXIST, null);
        }
    });
}

UserSchema.statics.findUserByEmail = function (email, cb) {
    this.findOne({ email: email }, (err, user) => {
        if (user) {
            cb(null, user);
        } else if (err) {
            cb(err, null);
        } else {
            cb(ERR_USER_DOESNT_EXIST, null);
        }
    });
}

UserSchema.statics.findUsersByName = function (name, cb) {
    this.find({ name: name }, (err, user) => {
        if (!user.length) {
            cb(null, user);
        } else if (err) {
            cb(err, null);
        } else {
            cb(ERR_USER_DOESNT_EXIST, null);
        }
    });
}

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
}

UserSchema.methods.setAvatarUrl = function (avatarUrl) {
    this.avatarUrl = avatarUrl;
    return this.save();
};

function encrypt(string) {
    return bcrypt.hashSync(string, saltRounds);
}

module.exports = UserSchema;