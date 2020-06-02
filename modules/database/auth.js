const mongo = require('mongodb');
const dbSchema = require('./dbSchema');
const utilities = require('./../utilities');
const ObjectId = mongo.ObjectID;
const url = "mongodb://localhost:27017/";
const MongoClient = mongo.MongoClient;


const getUserBasicInfoMap = function(users){
    return users.map(function (user) {
        return {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            age: utilities.calculateAge(user.birthDay),
            status: user.status,
            city: user.city,
            country: user.country,
            profileImagePath: user.profileImagePath,
        };
    })
}

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

    getUserById: async function (id) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                let query;
                if (err) throw err;
                let dbo = db.db("quickMess");
                dbo.collection("users").findOne({_id: ObjectId(id)}, function (err, result) {
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

    insertFriendRequest: async function (user_id, user_who_requested_friendship) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let dbo = db.db("quickMess");
                dbo.collection("users").updateOne(
                    {_id: ObjectId(user_id)},
                    {$addToSet: {friendRequests: ObjectId(user_who_requested_friendship)}}, function (err, res) {
                        if (err) throw err;
                        dbo.collection("users").updateOne(
                            {_id: ObjectId(user_who_requested_friendship)},
                            {$addToSet: {friendRequestsSentByMe: ObjectId(user_id)}}, function (err, res) {
                                if (err) throw err;
                                resolve();
                                db.close();
                            }
                        )
                    }
                )
            });
        });
    },

    getFriendRequestsById: async function (user_id) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let dbo = db.db("quickMess");
                dbo.collection("users").findOne({_id: ObjectId(user_id)}, function (err, result){
                    if (err) throw err;
                    if (result != null && typeof result != "undefined")
                        resolve({friendRequests: result["friendRequests"], friendRequestsSentByMe: result["friendRequestsSentByMe"]});
                    db.close();
                });
            });
        });
    },

    getFriendsById: async function (user_id) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let dbo = db.db("quickMess");
                dbo.collection("users").findOne({_id: ObjectId(user_id)}, function (err, result){
                    if (err) throw err;
                    if (result != null && typeof result != "undefined")
                        resolve(result["friends"]);
                    else
                        resolve([]);
                    db.close();
                });
            });
        });
    },

    clearFriendRequest: async function(user_id, user_who_requested_friendship){
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let dbo = db.db("quickMess");
                dbo.collection("users").updateOne(
                    {_id: ObjectId(user_id)},
                    {$pull: {friendRequests: ObjectId(user_who_requested_friendship)}}, function (err, res) {
                        if (err) throw err;
                        dbo.collection("users").updateOne(
                            {_id: ObjectId(user_who_requested_friendship)},
                            {$pull: {friendRequestsSentByMe: ObjectId(user_id)}}, function (err, res) {
                                if (err) throw err;
                                resolve();
                                db.close();
                            }
                        )
                    }
                )
            });
        });
    },

    removeFriendship: async function(user_id, user_who_requested_remove_friendship){
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let dbo = db.db("quickMess");
                dbo.collection("users").updateOne(
                    {_id: ObjectId(user_id)},
                    {$pull: {friends: ObjectId(user_who_requested_remove_friendship)}}, function (err, res) {
                        if (err) throw err;
                        dbo.collection("users").updateOne(
                            {_id: ObjectId(user_who_requested_remove_friendship)},
                            {$pull: {friends: ObjectId(user_id)}}, function (err, res) {
                                if (err) throw err;
                                resolve();
                                db.close();
                            }
                        )
                    }
                )
            });
        });
    },

    updateUserStatus: async function(id, status){
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let dbo = db.db("quickMess");
                dbo.collection("users").updateOne({_id: ObjectId(id)},{$set: {status: status}}, function (err){
                    if (err) throw err;
                    resolve();
                    db.close();
                });
            });
        });
    },

    insertFriendship(user_id, user_who_requested_friendship){
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let dbo = db.db("quickMess");
                dbo.collection("users").updateOne(
                    {_id: ObjectId(user_id)},
                    {$addToSet: {friends: ObjectId(user_who_requested_friendship)}}, function (err, res) {
                        if (err) throw err;
                        dbo.collection("users").updateOne(
                            {_id: ObjectId(user_who_requested_friendship)},
                            {$addToSet: {friends: ObjectId(user_id)}}, function (err, res) {
                                if (err) throw err;
                                resolve();
                                db.close();
                            }
                        )
                    }
                )
            });
        });
    },

    getUserPostsById: async function (id) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
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

    getUsersBasicInfo: async function () {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let dbo = db.db("quickMess");
                dbo.collection("users").find({}).toArray(function (err, result){
                    if (err) throw err;
                    if (result != null && typeof result != "undefined"){
                        resolve(getUserBasicInfoMap(result));
                    } else {
                        resolve([]);
                    }
                    db.close();
                });
            });
        });
    },

    getUsersBasicInfoByMultipleIds: async function (ids) {
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, {useUnifiedTopology: true,}, function (err, db) {
                if (err) throw err;
                let dbo = db.db("quickMess");
                let object_ids = ids.map(function(id){
                    return ObjectId(id);
                })
                dbo.collection("users").find({_id : {$in: object_ids}}).toArray(function (err, result){
                    if (err) throw err;
                    if (result != null && typeof result != "undefined"){
                        resolve(getUserBasicInfoMap(result));
                    } else {
                        resolve([]);
                    }
                    db.close();
                });
            });
        });
    },
}