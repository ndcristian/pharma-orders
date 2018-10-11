/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require('express');
var router = express.Router();
var route = require('../models/route_models'); // Project configuration
var crud = require('../models/crud_models'); //used for GET/INSERT/UPDATE/DELETE
var ObjectID = require('mongodb').ObjectID;
var service = require('../routesmodels/services'); //Other user functions
//Get home page
//console.log('created main routes');

var routes = service.project(project.model.routes);

//Generate all routes based on project.json
routes.forEach(function (route, index) {
    if (route.type === "get") {
        router.get("/" + route.route, ensureAuthenticated, function (req, res) {
            if (service.checkRights(req.user, route.rol)) {
                var query = {query: route.query.query, sort: route.query.sort};
                if (route.restrictedId){
                    query.query[route.restrictedId] = req.user._id.toString();
                    console.log ('query in get', query );
                }
                crud.models[route.model_function](project.model.database, route.collection, query.query, query.sort, function (err, items) {
                    //console.log ('items in ' + route.route +':' ,items),
                    res.render(route.template, {items: items});
                });
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify([]));
            }
        });
        router.get("/" + route.route + "/:" + route.id, ensureAuthenticated, function (req, res) {
            if (service.checkRights(req.user, route.rol)) {
                var query = {query: {[route.routeIdField]: req.params[route.routeIdField]}, sort: {}};
                crud.models[route.model_function](project.model.database, route.collection, query.query, query.sort, function (err, items) {
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
            crud.models[route.model_function](project.model.database, route.collection, req.body, function (err, items) {
                res.status(201);
                res.send(items.ops[0]);
            });
        });
        router.post("/" + route.route + "/:_id", ensureAuthenticated, function (req, res) {
            var query = {query: {_id: ObjectID(req.params._id)}, data: req.body, user: req.user._id};
            crud.models[route.model_function](project.model.database, route.collection, query, function (err, items) {
                res.status(201);
                res.redirect('/');
            });
        });
        router.delete("/" + route.route + "/:_id", ensureAuthenticated, function (req, res) {
            var _id = ObjectID(req.params._id);
            crud.models.delete(project.model.database, route.collection, {_id: _id}, function (err, items) {
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
            crud.models.put(project.model.database, route.collection, query, update, function (err, items) {
                res.setHeader('Content-Type', 'application/json');
                res.send(items);
            });
        });
    }
});

router.get('/admin', ensureAuthenticated, function (req, res) {
    if (service.checkRights(req.user, project.apiAdminRouteAccess)) {
        //console.log('/admin info user', req.user, project.apiAdminRouteAccess);
        res.render('admin/admin', {layout: false});
    } else {
        res.redirect('/users/logout');
    }
});
// used from dojo main.js to get user info 
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

