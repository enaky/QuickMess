const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage(
    {
        destination: './public/images',
        filename: function (req, file, cb) {
            cb(null, file.originalname + '-' + Date.now() + ".png");
        }
    }
);

module.exports = {
    upload: multer({storage: storage})
}
