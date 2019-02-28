var MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');
assert = require('assert');
// Connection url
var url = 'mongodb://localhost';
// Connect using MongoClient

module.exports.models = {
  get: function(database, collection, query, sort, callback) {
    MongoClient.connect(url, function(err, client) {
      var db = client.db(database);
      console.log('from crud_models query este : ', query, sort);
      db.collection(collection.main).find(query).sort(sort).toArray(callback);
    });
  },
  post: function(database, collection, query, callback) {
    MongoClient.connect(url, function(err, client) {
      var db = client.db(database);
      db.collection(collection.main).insertOne(query, callback);
    });
  },
  delete: function(database, collection, query, callback) {
    MongoClient.connect(url, function(err, client) {
      //
      var db = client.db(database);
      db.collection(collection.main).deleteOne(query, callback);
    });
  },
  put: function(database, collection, query, update, callback) {
    MongoClient.connect(url, function(err, client) {
      var db = client.db(database);
      console.log('----crud-models PUT query: ', query);
      db.collection(collection.main).updateOne(query, update,{ upsert: true }, callback);
    });
  },
  deleteMany: function(database, collection, query, callback){
    MongoClient.connect(url, function(err, client) {
      //
      var db = client.db(database);
      db.collection(collection.main).remove(query, callback);
    });
  },

  // used to get records from one table, add somethings and post the new result into another table
  // to do that we pass the original _id to an new id with a name fomed from the collection name and "Id"
  // then we have to iterate all new filds to add in new post and for that we get data from query.data who have
  // data from req.params
  get_post: function(database, collection, query, callback) {
    MongoClient.connect(url, function(err, client) {
      var db = client.db(database);
      //get items from get collections that have the id specified in route request params
      db.collection(collection.get).find(query.query).toArray(function(err, items) {
        if (items) {
          //create a proprety createdId to store the match id from the match collection and add them
          //to the record received from get request
          newItemIdName = 'createdId';
          items[0][newItemIdName] = items[0]._id;
          // add the playerId
          items[0].playerId = query.user;
          // delete the original id
          delete items[0]._id;
          // create new propreties to item from first get to store the form data and post it in post coleection 
          var keys = Object.keys(query.data);
          keys.forEach(function(item, index, array) {
            items[0][item] = query.data[item];
            items[0][item] = query.data[item];
          });
          //console.log('get-post items to insert', items);
          db.collection(collection.post).insert(items, callback);
        }
      });
    });
  },
  // used to find if the returned items of first get from main collection is found in the second get 
  // from get collection. if found it is removed from the first get result
  get_get: function(database, collection, query, sort, callback) {
    MongoClient.connect(url, function(err, client) {
      var db = client.db(database);
      db.collection(collection.main).find(query).sort(sort).toArray(function(err, items) {
        queryArray = []; // an array with all ids to look for in the second get request
        //we asume that createdId will be the fild to look for. if we find other situations where we need 
        // something more general we have to find a solution
        idProprety = 'createdId';
        items.forEach(function(item, index, array) {
          queryArray.push({
            [idProprety]: item._id
          });
        });
        db.collection(collection.get).find({
          $or: queryArray
        }, {
          createdId: 1,
          _id: 0
        }).toArray(function(err, itemsFound) {
          callback(err, service(err, items, itemsFound));
        });
      });
    });
  }
};