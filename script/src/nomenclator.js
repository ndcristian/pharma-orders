var exceltojson = require("xlsx-to-json-lc");
var MongoClient = require('mongodb').MongoClient;

exceltojson({
    input: "./nomenclatorprh.xlsx",
    output: null,//"./nomenclator.json", // sau null daca nu vrem save in fisier
    sheet: "Sheet1", // specific sheetname inside excel file (if you have multiple sheets)
    noheader: true,
    lowerCaseHeaders: true //to convert all excel headers to lowr case in json
}, function (err, result) {

    if (err) {
        console.error(err);
    } else {
        // insert into collection

        MongoClient.connect("mongodb://localhost/loginapp", function (err, client) {
            if (err) {
                return console.dir(err);
            }
           var db = client.db('loginapp');
            var collection = db.collection('nomenclator');
            var oferta = db.collection('oferta');
            var index = 0;
            var produse = []; // build a newResult with oferta_xo
            result.forEach(function (document) {
               
                oferta.findOne({itemid: document.itemID}, function (err, itemFound) {
                     
                    if (itemFound !== null) {
                        document.Oferta = 1;
                    } else {
                        document.Oferta = 0;
                    }
                    
                    produse.push(document);
                    index =index + 1;
                    if (index === result.length) {
                        console.log(result);
                        insertResult(produse);
                    }
                });

            }
            );
            function insertResult(newResult) {
                console.log("Start inserting....");
                collection.remove({}, function (err, results) {

                    if (err) {
                        return console.dir(err);
                    }

                    collection.insert(newResult, function (err, result) {

                        if (err) {
                            return console.dir(err);
                        }

                        collection.count(function (err, insertedDoc) {
                            console.log("records inserted:", insertedDoc);
                            client.close(function (a, b) {
                                console.log("Database closed....", a, b);
                            });
                        });
                    });

                });
            }
        });
    }
});



