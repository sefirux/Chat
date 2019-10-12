const Jimp = require('jimp');
const Path = require('path');

const dest = Path.join(__dirname, '../uploads/images');

const resize = (file, fieldname, cb) => {
    if (!file) return cb('No file to resize.', null);

    Jimp.read(file.path, (err, file) => {
        if (err) return cb(err, null);
        
        const fileName = `${fieldname}-${Date.now()}.png`;
        const destPath = `${dest}/${fileName}`;
        const imgUrl = `public/${fileName}`;

        file
            .resize(256, 256)
            .quality(50)
            .write(destPath);

        cb(null, imgUrl);
    });
};

module.exports = resize;