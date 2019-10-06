const multer = require('multer');
const path = require('path');

const IMG_DESTINATION_FOLDER = path.join(__dirname, '../uploads/images');
const FILE_DESTINATION_FOLDER = path.join(__dirname, '../uploads');
const ERR_FORMAT = 'Only images are allowed';

const filesStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, FILE_DESTINATION_FOLDER);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMG_DESTINATION_FOLDER);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: filesStorage,
    onFileUploadStart: function (file) {
        console.log(file.fieldname + ' is starting ...')
    },
    onFileUploadData: function (file, data) {
        console.log(data.length + ' of ' + file.fieldname + ' arrived')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
    }
});

const uploadImg = multer({
    storage: imageStorage,
    fileFilter: function (req, file, callback) {
        const ext = path.extname(file.originalname).toLocaleLowerCase();
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            callback(ERR_FORMAT, false);
        } else {
            callback(null, true);
        }
    },
    onFileUploadStart: function (file) {
        console.log(file.fieldname + ' is starting ...')
    },
    onFileUploadData: function (file, data) {
        console.log(data.length + ' of ' + file.fieldname + ' arrived')
    },
    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
    }
});

module.exports = {upload, uploadImg};