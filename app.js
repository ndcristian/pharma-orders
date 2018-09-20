var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var config = require ("./appconfig");
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
//var api = require('./routes/api');

// Init App
var app = express();

// set app configuration
console.log("App name is : ",config.appName);

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout',
      helpers: {
    ifMatch: function (rol) {
      if(rol=== "admin" || rol==="creator" ){
        var showAdmin= true;
      } else {
        var showAdmin= false; 
      }
      return showAdmin ;
    },
    logoNameParser : function (name) {
        name = name.replace(/ /g,'');
        name = name.toLowerCase();
        //console.log('name', name, typeof name);
        return name;
    }
  }
                          
}));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
  var namespace = param.split('.')
  , root =namespace.shift()
  , formParam = root;
  
  while(namespace.length) {
    formParm+= '[' +namespace.shift() + ']';
}
return {
  param : formParam,
  msg   : msg,
  value : value
};
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req,res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.appName = config.appName;
 // console.log(app);
  next();
});

app.use('/', routes);
app.use('/users', users);
//app.use('/api', api);

MongoClient.connect('mongodb://localhost', function (err,client){
  var db = client.db('loginapp');
   if (err) {
    console.log(`Failed to connect to the database. ${err.stack}`);
  }
  app.locals.db = db;

  app.set('port', (process.env.PORT || 3000));
  app.listen(app.get('port'), function(){
  console.log('Server started on port' + app.get('port'));
  
 });
});


