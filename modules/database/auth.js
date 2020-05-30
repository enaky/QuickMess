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
                if (typeof password != "undefined") {
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
    insertPostMessage: async function (post) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let dbo = db.db("quickMess");
                dbo.collection("users").update(
                    {_id: ObjectId(post.owner)},
                    {$push: {posts: post}}, function (err, res) {
                        if (err) throw err;
                        resolve();
                        db.close();
                    }
                )
            });
        });
    },
    getUserPostsById: async function (id) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                let query;
                if (err) throw err;
                let dbo = db.db("quickMess");
                dbo.collection("users").findOne({_id: ObjectId(id)}, function (err, result){
                if (err) throw err;
                    if (result != null && typeof result != "undefined")
                    resolve(result["posts"]);
                    db.close();
                });
            });
        });
    },
}