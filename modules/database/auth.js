const mongo = require('mongodb');
const dbSchema = require('./dbSchema');
const ObjectId = mongo.ObjectID;
const url = "mongodb://localhost:27017/";
const MongoClient = mongo.MongoClient;

module.exports = {
    getUser: async function (username, password) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                let query;
                if (err) throw err;
                let dbo = db.db("quickMess");
                if (typeof password != "undefined"){
                    query = {"username": username, "password": password};
                } else {
                    query = {"username": username};
                }
                dbo.collection("users").findOne(query, function (err, result) {
                    if (err) throw err;
                    resolve(result);
                    db.close();
                });
            });
        });
    },
    insertUser: async function (user) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let dbo = db.db("quickMess");
                dbo.collection("users").insertOne(user, function (err, res) {
                    if (err) throw err;
                    resolve();
                    db.close();
                });
            });
        });
    },
}