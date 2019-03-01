//var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var database = require("./models/appconfig").database;
//var dbUrl = 'mongodb://localhost/' + database;
var dbUrl = 'mongodb://localhost/';

let db;
//let clinetDB;

MongoClient
  .connect(dbUrl, {
    useNewUrlParser: true,
    poolSize: 10
  })
  .then(client => {
    db = client.db(database);
    console.log('connected at mongodb://localhost')
  })
  .catch(error => console.error(error));



//----------------------------------------------------
module.exports.createUser = function(newUser, callback) {
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;

        db.collection('users').insert(newUser, callback);
    });
  });
};
//---------------------------------------------------trebuie sa folosesc updateOne cu id user ca filtru
module.exports.updateUser = function(updateUser, url, callback) {
  if (url === '/account') {
    db.collection('users').updateOne({
        _id: ObjectID(updateUser._id)
      }, {
        $set: {
          name: updateUser.name,
          surname: updateUser.surname
        }
      }, callback);

  } else {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(updateUser.password, salt, function(err, hash) {
        updateUser.password = hash;
          db.collection('users').updateOne({
            _id: ObjectID(updateUser._id)
          }, {
            $set: {
              password: updateUser.password
            }
          }, callback);
      });
    });
  }
};
//----------------------------------------------------
module.exports.getUserByUsername = function(email, callback) {
  var query = {
    email: email
  };
    db.collection('users').findOne(query, callback);
};
//-----------------------------------------------------
module.exports.getUserById = function(id, callback) {
  var query = {
    _id: ObjectID(id),
  };
    db.collection('users').findOne(query, callback);
};
//------------------------------------------------------
module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err)
      throw err;
    callback(null, isMatch);
  });
};