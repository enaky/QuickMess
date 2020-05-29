const mongo = require('mongodb');
const dbSchema = require('./dbSchema');
const ObjectId = mongo.ObjectID;
const url = "mongodb://localhost:27017/";
const MongoClient = mongo.MongoClient;

module.exports = {
    getUser: async function (username) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let dbo = db.db("quickMess");
                let query = {"username": username};
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
    userExists: async function (username) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let query = {"username": username};
                let dbo = db.db("quickMess");
                dbo.collection("users").insert(username, function (err, res) {
                    if (err) throw err;
                    resolve();
                    db.close();
                });
            });
        });
    },

}