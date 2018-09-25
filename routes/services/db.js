var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;

var db = MongoClient.connect('mongodb://localhost', function (err,client){
  var db = client.db('loginapp');
   if (err) {
    console.log(`Failed to connect to the database. ${err.stack}`);
  }
//return db;
});
module.exports.db;