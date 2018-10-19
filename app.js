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
var appconfig = require("./routes/models/appconfig");


var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./web/app/routes');

// Init App
var app = express();

//react
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());
//optional for react 
//var options = { beautify: true };
//app.engine('jsx', require('express-react-views').createEngine(options));

// View Engine
app.set('views', path.join(__dirname, 'views'));

//handlebars
// app.engine('handlebars', exphbs({
//   defaultLayout: 'layout',
//   helpers: {
//     ifMatch: function(rol) {
//       var showAdmin;
//       if (rol === "admin" || rol === "creator") {
//         showAdmin = true;
//       } else {
//         showAdmin = false;
//       }
//       return showAdmin;
//     },
//     logoNameParser: function(name) {
//       name = name.replace(/ /g, '');
//       name = name.toLowerCase();
//       //console.log('name', name, typeof name);
//       return name;
//     }
//   }

// }));
// app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
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
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParm += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  res.locals.appName = appconfig.appName;
  // console.log(app);
  next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/routes', routes);

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
  console.log('Server started on port' + app.get('port'));
});