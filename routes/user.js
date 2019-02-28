//var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
///var database = require("./models/appconfig").database;
var dbUrl = 'mongodb://localhost/' + database;
var database = 'pharma';
//----------------------------------------------------
module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;

      MongoClient.connect(dbUrl, function(err, client) {
        var db = client.db(database);
        db.collection('users').insert(newUser, callback);
      });
    });
  });
};
//---------------------------------------------------trebuie sa folosesc updateOne cu id user ca filtru
module.exports.updateUser = function(updateUser, url, callback) {
  if (url === '/account') {
    MongoClient.connect(dbUrl, function(err, client) {
      var db = client.db(database);
      db.collection('users').updateOne({
        _id: ObjectID(updateUser._id)
      }, {
        $set: {
          name: updateUser.name,
          surname: updateUser.surname
        }
      }, callback);
    });

    //updateUser.save(callback);
  } else {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(updateUser.password, salt, function(err, hash) {
        updateUser.password = hash;
        MongoClient.connect(dbUrl, function(err, client) {
          var db = client.db(database);
          db.collection('users').updateOne({
            _id: ObjectID(updateUser._id)
          }, {
            $set: {
              password: updateUser.password
            }
          }, callback);
        });
        // updateUser.save(callback);
      });
    });
  }
};
//----------------------------------------------------
module.exports.getUserByUsername = function(email, callback) {
  var query = {
    email: email
  };
  MongoClient.connect(dbUrl, function(err, client) {
    var db = client.db(database);
    db.collection('users').findOne(query, callback);
  });
  //User.findOne(query, callback);
};
//-----------------------------------------------------
module.exports.getUserById = function(id, callback) {
  var query = {
    _id: ObjectID(id),
  };
  MongoClient.connect(dbUrl, function(err, client) {
    var db = client.db(database);
    db.collection('users').findOne(query, callback);
  });

  //User.findById(id, callback);
};
//------------------------------------------------------
module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err)
      throw err;
    callback(null, isMatch);
  });
};