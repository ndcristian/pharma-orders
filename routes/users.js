var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var services = require('./services/services');
var User = require('./user');
var project = require('./models/appconfig');


// Register
router.get('/register', function(req, res) {
  res.render('register');
});

// Login
router.get('/login', function(req, res) {
  // to do: 
  // i have to store every acces of this route into an array an check every time if 
  //this route was accesed before and reject the request

  // i have to define in routes models the rights for each route and compare with user right in the routes generator
  res.render('login', {locals:res.locals});
});

// Register User
router.post('/register', function(req, res) {
  var name = req.body.name;
  var surname = req.body.surname;
  var email = req.body.email;
  var cui = req.body.cui;
  var pl = req.body.pl;
  var client = req.body.client;
  var password = req.body.password;
  var password2 = req.body.password2;
  //console.log(req.body);
  // validation
  req.checkBody('name', ' Name is required ').notEmpty();
  req.checkBody('surname', ' Surname is required ').notEmpty();
  req.checkBody('email', ' Email is required ').notEmpty();
  req.checkBody('email', ' Email is required ').isEmail();
  req.checkBody('cui', ' Cui is required ').notEmpty();
  req.checkBody('pl', ' PL is required ').notEmpty();
  req.checkBody('client', ' Client is required ').notEmpty();
  req.checkBody('password', ' Password is required ').notEmpty();
  req.checkBody('password2', ' Password2 is required ').equals(req.body.password);

  var errors = req.validationErrors();
  if (errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    var newUser = {
      name: name,
      surname: surname,
      rol: 'restricted',
      email: email,
      cui:cui,
      pl:pl,
      client:client,
      password: password
    };

    User.createUser(newUser, function(err, user) {
      if (err) {
        // throw err;
        req.flash('error_msg', 'User already exists');
        res.redirect('/users/login');
      } else {
        req.flash('success_msg', 'You are registred and can now login');
        res.redirect('/users/login');
      }
    });
  }
});

passport.use(new LocalStrategy(
  function(email, password, done) {
    User.getUserByUsername(email, function(err, user) {
      if (err)
        throw err;
      if (!user) {
        return done(null, false, {
          message: 'invalid user or password'
        });
      }

      User.comparePassword(password, user.password, function(err, isMatch) {
        if (err)
          throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'invalid user or password'
          });
        }
      });
    });
  }));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});
// Original login route
//router.post('/login',
//        passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
//        function (req, res) {
//            res.redirect('/');
//        });

router.post('/login', function(req, res, next) {
  //console.log ('req.app', req);
  if (services.checkAlert(req.connection.remoteAddress, false)) {
    res.status(404).end();
  } else {
    passport.authenticate('local', {
      failureFlash: true
    }, function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        services.last10(req.connection.remoteAddress, false);
        req.flash('error_msg', 'Invalid user or password');
        return res.redirect('/users/login');
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        // return res.redirect('/');
        res.redirect('/main');
      });
    })(req, res, next);
  }
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

//change password
router.get('/resetpassword', function(req, res) {
  res.render('resetpassword');
});

router.post('/resetpassword', function(req, res) {
  if (services.checkAlert(req.connection.remoteAddress, true)) {
    res.status(404).end();
  } else {
    User.getUserByUsername(req.body.username, function(err, user) {
      var initUser = {};
      if (err)
        throw err;
      if (!user) {
        res.render('confirm_reset', {
          message_reset: 'This email is not registred: ' + req.body.username
        });
      } else {
        services.last10(req.connection.remoteAddress, true);
        var password = req.sessionID.substring(2, 8);
        user.password = password;
        initUser = {
          name: user.name,
          password: password,
          email:user.email
        };
        User.updateUser(user, req.url, function(err, usermodified) {
          services.sendMail(initUser, function(err, info) {
            if (err) {
              req.flash('error_msg', 'Error resset password');
              res.redirect('/users/login');
            } else {
              res.render('confirm_reset', {
                message_reset: 'Your new password was sent to your e-mail address:  ' + user.email
              });
            }
          });
        });
      }
    });
  }
});

router.post('/changepassword', ensureAuthenticated, function(req, res) {
  var user = req.user;
  var oldPassword = req.body.oldpassword;

  User.comparePassword(oldPassword, user.password, function(err, isMatch) {
    if (err)
      throw err;
    if (isMatch) {
      user.password = req.body.newpassword;
      User.updateUser(user, req.url, function(err, usermodified) {
        req.flash('success_msg', 'Your data was updated!');
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/users/confirm_change');
      });
    } else {
      return done(null, false, {
        message: 'invalid  password'
      });
    }
  });
});

router.get('/account', ensureAuthenticated, function(req, res) {
  var toDisplay = (project.infoLivrare === "not") ? false : true;
  //var hidden = true;
  delete req.user.password;
  res.render('account', {
    locals: res.locals,
  });
});
router.post('/account', ensureAuthenticated, function(req, res) {
  var user = req.user;
  user.name = req.body.name;
  user.surname = req.body.surname;
  User.updateUser(user, req.url, function(err, usermodified) {
    if (err){
      req.flash('error_msg', 'Your data was NOT updated!');
    } else {
      req.flash('success_msg', 'Your data was updated!');
      res.redirect('/users/account');
    }
    
  });
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