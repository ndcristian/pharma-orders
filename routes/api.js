var express = require('express');
var router = express.Router();
var project = require('../apimodels/apimodels.json'); // Project configuration
var apimodels = require('../apimodels/apimodels'); //used for GET/INSERT/UPDATE/DELETE
var ObjectID = require('mongodb').ObjectID;
var service = require('../apimodels/services'); //Other user functions
//Get home page
var routes = service.project(project.routes);
console.log('created apiroutes');
//Generate all routes based on project.json
routes.forEach(function (route, index) {
    if (route.type === "get") {
        router.get("/" + route.route, ensureAuthenticated, function (req, res) {
            if (service.checkRights(req.user, route.rol)) {
                var query = service.queryparse(req.query, req.user, route.queryId);
                apimodels.models.get(project.database, route.collection, query.query, query.sort, function (err, items) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(items));
                });
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify([]));
            }
        });
        router.get("/" + route.route + "/:" + route.routeIdField, ensureAuthenticated, function (req, res) {
            if (service.checkRights(req.user, route.rol)) {
                console.log("req.params :id", req);
                var query = {query:{[route.routeIdField]:req.params[route.routeIdField]}, sort:{}};
                apimodels.models.get(project.database, route.collection, query.query, query.sort, function (err, items) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(items));
                });
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify([]));
            }
        });
    } else {
        router.post("/" + route.route, ensureAuthenticated, function (req, res) {
            apimodels.models.post(project.database, route.collection, req.body, function (err, items) {
                res.setHeader('Content-Type', 'application/json');
                res.status(201);
                res.send(items.ops[0]);
            });
        });
        router.delete("/" + route.route + "/:_id", ensureAuthenticated, function (req, res) {
            var _id = ObjectID(req.params._id);
            apimodels.models.delete(project.database, route.collection, {_id: _id}, function (err, items) {
                res.setHeader('Content-Type', 'application/json');
                res.send(items);
            });
        });
        router.put("/" + route.route + "/:_id", ensureAuthenticated, function (req, res) {
            var _id = ObjectID(req.body._id);
            query = {_id: _id};
            object = req.body;
            delete req.body._id;
            var update = {$set: object};
            apimodels.models.put(project.database, route.collection, query, update, function (err, items) {
                res.setHeader('Content-Type', 'application/json');
                res.send(items);
            });
        });
    }
});

router.get('/admin', ensureAuthenticated, function (req, res) {
    if (service.checkRights(req.user, project.apiAdminRouteAccess)) {
        console.log('/admin info user', req.user, project.apiAdminRouteAccess);
        res.render('admin/admin', {layout: false});
    } else {
        res.redirect('/users/logout');
    }

});
// used from main.js to get user info in dojo framework
router.get('/inf', ensureAuthenticated, function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(req.user);
});
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //req.flash('error_msg', 'You are not logged in');
        res.redirect('/users/login');
    }
}

module.exports = router;