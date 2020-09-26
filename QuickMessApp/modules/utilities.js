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
    readFileAsync: function (filename) {
        return new Promise((resolve, reject) => {
            fs.readFile(filename, function read(err, rawdata) {
                if (err) {
                    throw err;
                }
                resolve(JSON.parse(rawdata));
            });
        });
    },
    calculateAge: function (birthday) { // birthday is a date
        let ageDifMs = Date.now() - birthday.getTime();
        let ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    },
    filterByValue: function (users, value) {
        return users.filter(user =>
            Object.keys(user).some(key => {
                if (key === "profileImagePath" || key === "_id"){
                    return false;
                }
                return user[key].toString().toLowerCase().includes(value.toLowerCase())
            }));
    },
    upload: multer({storage: storage})
}
