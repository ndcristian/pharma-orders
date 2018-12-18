var exceltojson = require("xlsx-to-json-lc");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost/loginapp';

var db = MongoClient.connect(url);
//var sqlite3 = require('sqlite3').verbose();
//var db = new sqlite3.Database('alumgates.sqlite');

exceltojson({
  input: "./oferte_web.xlsx",
  output: null, //"./oferta.json", // sau null daca nu vrem save in fisier
  sheet: "Sheet1", // specific sheetname inside excel file (if you have multiple sheets)
  noheader: true,
  lowerCaseHeaders: true //to convert all excel headers to lowr case in json
}, function(err, result) {

  if (err) {
    console.error(err);
  } else {
    //console.log(result);
    // insert into collection
    console.log("Start inserting....");
    MongoClient.connect("mongodb://localhost/pharma", function(err, client) {
      if (err) {
        return console.dir(err);
      }
      var db = client.db('pharma');
      var collection = db.collection('oferte');
      //console.log(result);

      collection.remove({}, function(err, results) {

        if (err) {
          return console.dir(err);
        }

        collection.insert(result, function(err, result) {

          if (err) {
            return console.dir(err);
          }

          collection.count(function(err, insertedDoc) {
            console.log("records inserted:", insertedDoc);
            client.close(function(a, b) {
              console.log("Database closed....", a, b);
              process.exit(1);
            });
          });

        });

      });


    });

  }
});