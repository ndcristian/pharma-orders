/* routes is generated autoamte from route models.js

 */
var express = require('express');
var router = express.Router();
var route = require('./models/route_models'); // Project configuration
var crud = require('./models/crud_models'); //used for GET/INSERT/UPDATE/DELETE
var ObjectID = require('mongodb').ObjectID;
var controls = require('./controllers/controls'); //Other user functions
var database = require("../../routes/models/appconfig").database;

var routes = controls.project(route.model.routes);


// route generator based on route_models and crud_models
routes.forEach(function(route, index) {
  if (route.type === "get") {
    router.get("/" + route.route, ensureAuthenticated, function(req, res) {
      //console.log("--- app/routes.js -get controls este (pentru ruta) - " +route.route +':::' , controls.queryparse(req.query, req.user));
      if (controls.checkRights(req.user, route.rol)) {
        var query = controls.queryparse(req.query, req.user);
        //console.log("app/routes - get query este(pentru ruta) - " +route.route +':::' ,query);
        //         if (route.restrictedId) {
        //           query.query[route.restrictedId] = req.user._id.toString();
        //         }
        crud.models[route.model_function](database, route.collection, query.query, query.sort, function(err, items) {
          //console.log ('items in ' + route.route +':' ,items),
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(items));
        });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([]));
      }
    });

    router.get("/" + route.route + "/:" + route.id, ensureAuthenticated, function(req, res) {
      //       console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%app/routes REQUEST este', req);
      if (controls.checkRights(req.user, route.rol)) {
        var query = {};
        query.query = req.params


        //console.log(':******mesaj din app/routes - get/: query este', query);
        crud.models[route.model_function](database, route.collection, query.query, query.sort, function(err, items) {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(items));
        });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify([]));
      }
    });
  } else {
    router.post("/" + route.route, ensureAuthenticated, function(req, res) {
      crud.models[route.model_function](database, route.collection, req.body, function(err, items) {
        res.status(201);
        console.log("from post route " + route.route, items.ops[0]);
        res.send(items.ops[0]);
      });
    });
    router.post("/" + route.route + "/:_id", ensureAuthenticated, function(req, res) {
      var query = {
        query: {
          _id: ObjectID(req.params._id)
        },
        data: req.body,
        user: req.user._id
      };
      crud.models[route.model_function](database, route.collection, query, function(err, items) {
        res.status(201);
        res.redirect('/');
      });
    });
    router.delete("/" + route.route + "/:" + route.id, ensureAuthenticated, function(req, res) {
      var _id = ObjectID(req.params._id);
      console.log("from routes delete rute:::::" + route.route, req.params);
      crud.models.delete(database, route.collection, {
        _id: _id
      }, function(err, items) {
        res.setHeader('Content-Type', 'application/json');
        res.send(items);
      });
    });
    router.put("/" + route.route + "/:" + route.id, ensureAuthenticated, function(req, res) {
      console.log(req.body[route.id]);
      var _id = "";
      //facem testul pentru ca in tabela conditii vreau sa compun id-ul din _id din comanda si numele furnizorului pentru a face update la fiecare on-change in dgrid
      if (route.route==='conditii') {
         _id = req.body[route.id];
      } else {
         _id = ObjectID(req.body[route.id]);
      }
      
      query = {
        _id: _id
      };
      var object = req.body;

      delete req.body._id;
      var update = {
        $set: object
      };
      crud.models.put(database, route.collection, query, update, function(err, items, event) {
        res.setHeader('Content-Type', 'application/json');
        //console.log ("from put route " + route.route, items, items.documents);
        var response = [];
        object._id = _id;
        response.push(object);
        if (!err) {
          res.send(object);
        }

      });
    });
  }
});
// special route for this project
router.delete("/necesar_clean/:_id", ensureAuthenticated, function(req, res) {
  //trebuie sa folosim _id ca sa obtinem id-ul produsului si api toate inregistrarile din necesar cu acest id produs pentru a le da ca parametru la remove
  //db.users.remove( { status : "P" } )
  var _id = ObjectID(req.params._id);
  console.log("from routes delete rute:::::" + route.route, req.params);
  crud.models.get(database, {main:'necesar'}, {
    _id: _id
  }, {}, function(err, produse) {
    crud.models.deleteMany(database, {main:'necesar'}, {
      produs: produse[0].produs
    }, function(err, items) {
      res.setHeader('Content-Type', 'application/json');
      res.send(items);
    });
  })


});

// used from dojo main.js to get user info 
router.get('/inf', ensureAuthenticated, function(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(req.user);
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    //     res.setHeader('Content-Type', 'text/html');
    req.flash('error_msg', 'You are not logged in');
    //     res.redirect('/users/login');
    res.send({
      error: 'Not logged in'
    })
  }
}

module.exports = router;