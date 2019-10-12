const Jimp = require('jimp');
const Path = require('path');

const DEFAULT_URL = '/public/';
const ERR_NO_FILE_TO_RESIZE = 'Error, no file to resize.';
const ERR_RESIZING_FILE = 'Resize file error.';
const dest = Path.join(__dirname, '../uploads/images');

const AVATAR_WIDTH = 320;
const AVATAR_HEIGHT = 320;
const AVATAR_QUALITY = 50;
const AVATAR_FIELDNAME = 'avatar';

const COVER_PAGE_WIDTH = 820;
const COVER_PAGE_HEIGHT = 360;
const COVER_PAGE_QUALITY = 50;
const COVER_PAGE_FIELDNAME = 'front';

const resize = (file, fieldname, width, height, quality, cb) => {
    if (!(file && fieldname)) return cb(ERR_NO_FILE_TO_RESIZE, null);

    Jimp.read(file.path, (err, file) => {
        if (err) return cb(ERR_RESIZING_FILE, null);

        const fileName = `${fieldname}-${Date.now()}.png`;
        const destPath = `${dest}/${fileName}`;
        const imgUrl = `${DEFAULT_URL}${fileName}`;

        file
            .resize(width, height)
            .quality(quality)
            .write(destPath);

        cb(null, imgUrl);
    });
};

const resizeAvatar = (file, cb) => {
    resize(
        file,
        AVATAR_FIELDNAME,
        AVATAR_WIDTH,
        AVATAR_HEIGHT,
        AVATAR_QUALITY,
        cb
    );
};

const resizeCover = (file, cb) => {
    resize(
        file,
        COVER_PAGE_FIELDNAME,
        COVER_PAGE_WIDTH,
        COVER_PAGE_HEIGHT,
        COVER_PAGE_QUALITY,
        cb
    );
};

module.exports = { resize, resizeAvatar, resizeCover };