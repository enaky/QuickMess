const mongo = require('mongodb');
const dbSchema = require('./dbSchema');
const utilities = require('./../utilities');
const ObjectId = mongo.ObjectID;
const url = "mongodb://localhost:27017/";
const MongoClient = mongo.MongoClient;


module.exports = {
    insertMessage: async function (user_1, user_2, message) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let dbo = db.db("quickMess");
                dbo.collection("chats").updateOne(
                    {
                        'users': {$all: [
                                {$elemMatch: { $eq: ObjectId(user_1)}},
                                {$elemMatch: { $eq: ObjectId(user_2)}}
                                ]
                        }
                    },
                    {$push: {messages: message}}, function (err) {
                        if (err) throw err;
                        resolve();
                        db.close();
                    }
                )
            });
        });
    },
    insertChat: async function (user_1, user_2) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let dbo = db.db("quickMess");
                dbo.collection("chats").updateOne({
                        'users': {$all: [
                                {$elemMatch: { $eq: ObjectId(user_1)}},
                                {$elemMatch: { $eq: ObjectId(user_2)}}
                            ]}
                        },
                    {$set: {'users': [ObjectId(user_1), ObjectId(user_2)]}}, { upsert: true },function (err) {
                        if (err) throw err;
                        resolve();
                        db.close();
                    }
                )
            });
        });
    },
    getMessages: async function (user_1, user_2) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let dbo = db.db("quickMess");
                dbo.collection("chats").findOne(
                    {
                        'users': {$all: [
                                {$elemMatch: { $eq: ObjectId(user_1)}},
                                {$elemMatch: { $eq: ObjectId(user_2)}}
                            ]}
                    },
                    function (err, result) {
                        if (err) throw err;
                        if (result != null && typeof result != "undefined"){
                            resolve(result["messages"]);
                        } else {
                            resolve([])
                        }
                        db.close();
                    }
                )
            });
        });
    },
}