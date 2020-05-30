const mongo = require('mongodb');
const url = "mongodb://localhost:27017/quickMess";
const MongoClient = mongo.MongoClient;


const _connectToDb = MongoClient.connect(url, {useUnifiedTopology: true,});

module.exports = _connectToDb