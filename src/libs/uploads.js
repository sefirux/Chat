const ObjectId = require('mongodb').ObjectId;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOADS_FOLDER = path.join(__dirname, './uploads');
const ERR_FORMAT = 'Only images are allowed';
const FIELD_NAME = 'userFile';

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        fs.mkdir(UPLOADS_FOLDER, err => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, UPLOADS_FOLDER);
            }
        });
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now()}_${ObjectId(file)}${path.extname(file.originalname)}`);
    }
});

const savePhoto = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        const ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            callback(ERR_FORMAT, false);
        } else {
            callback(null, true);
        }
    },
}).single(FIELD_NAME);

module.exports = savePhoto;