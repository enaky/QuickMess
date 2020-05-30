

module.exports = {
    getItems: async function () {
        return new Promise((resolve, reject) => {
            connectToDB.then((err, db) => {
                if (err) throw err;
                db.collection("users").find({}).toArray(function (err, result) {
                    if (err) throw err;
                    resolve(result);
                    db.close();
                });
            });
        });
    },
}