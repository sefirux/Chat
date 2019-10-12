const multer = require('multer');
const path = require('path');

const DESTINATION_FOLDER = path.join(__dirname, '../uploads/temp');
const ERR_FORMAT = 'Only images are allowed';
const IMAGE_SIZE_LIMIT = 4 * 1024 * 1024;

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DESTINATION_FOLDER);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const filterConfig = (req, file, callback) => {
    const ext = path.extname(file.originalname).toLocaleLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        callback(ERR_FORMAT, false);
    } else {
        callback(null, true);
    }
};

const imageUpload = multer({
    storage: storageConfig,
    fileFilter: filterConfig,
    limits: {
        fileSize: IMAGE_SIZE_LIMIT
    }
});

module.exports = imageUpload;