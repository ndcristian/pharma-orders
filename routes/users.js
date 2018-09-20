var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var controls = require('./controls/controls');
var User = require('./user');
var project = require('./models/route_models');
console.log('mesaj din users modul');
// Register
router.get('/register', function (req, res) {
    res.render('register');
});

// Login
router.get('/login', function (req, res) {
//  const db = req.app.locals.db;
//  db.collection('users').find().toArray(function(err,res){
//     if (err){
//       console.log('Failed xxx');
//     } else {
//       console.log (res);
//     }
//   });
    res.render('login');
});

// Register User
router.post('/register', function (req, res) {
    var name = req.body.name;
    var surname = req.body.surname;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    //console.log(req.body);
    // validation
    req.checkBody('name', ' Name is required ').notEmpty();
    req.checkBody('surname', ' Surname is required ').notEmpty();
    req.checkBody('email', ' Email is required ').notEmpty();
    req.checkBody('email', ' Email is required ').isEmail();
    req.checkBody('password', ' Password is required ').notEmpty();
    req.checkBody('password2', ' Password2 is required ').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: name,
            surname: surname,
            rol: 'player',
            email: email,
            password: password
        });

        User.createUser(newUser, function (err, user) {
            console.log('daca avem eroare');
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
        function (email, password, done) {
            User.getUserByUsername(email, function (err, user) {
                if (err)
                    throw err;
                if (!user) {
                    return done(null, false, {message: 'invalid user or password'});
                }
                User.comparePassword(password, user.password, function (err, isMatch) {
                    if (err)
                        throw err;
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: 'invalid user or password'});
                    }
                });
            });
        }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});
// Original login route
//router.post('/login',
//        passport.authenticate('local', {successRedirect: '/', failureRedirect: '/users/login', failureFlash: true}),
//        function (req, res) {
//            res.redirect('/');
//        });

router.post('/login', function (req, res, next) {
    console.log ('req.app', req);
    if (controls.checkAlert(req.connection.remoteAddress, false)) {
        res.status(404).end();
        console.log('A IESIT din check alert');
    } else {
        passport.authenticate('local', {failureFlash: true}, function (err, user, info) {
          console.log ('user in login', user);
            if (err) {
                return next(err);
            }
            if (!user) {
                controls.last10(req.connection.remoteAddress, false);
                req.flash('error_msg', 'Invalid user or password');
                return  res.redirect('/users/login');

            }
//             req.logIn(user, function (err) {
//                 if (err) {
//                     return next(err);
//                 }
//                 return res.redirect('/');
//             });
        })(req, res, next);
    }


});

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

//change password
router.get('/resetpassword', function (req, res) {
    res.render('resetpassword');
});

router.post('/resetpassword', function (req, res) {
    if (controls.checkAlert(req.connection.remoteAddress, true)) {
        res.status(404).end();
    } else {
        User.getUserByUsername(req.body.username, function (err, user) {
            var initUser = {};
            if (err)
                throw err;
            if (!user) {
                res.render('confirm_reset', {message_reset: 'This email is not registred: ' + req.body.username});
            } else {
                controls.last10(req.connection.remoteAddress, true);
                var password = req.sessionID.substring(2, 8);
                user.password = password;
                initUser = {name: user.name, password: password};
                User.updateUser(user, req.url, function (err, usermodified) {
                    controls.sendMail(initUser, function (err, info) {
                        if (err) {
                            req.flash('error_msg', 'Error resset password');
                            res.redirect('/users/login');
                        } else {
                            res.render('confirm_reset', {message_reset: 'Your new password was sent to your e-mail address:  ' + user.email});
                        }
                    });
                });
            }
        });
    }
});

router.post('/changepassword', function (req, res) {
    var user = req.user;
    var oldPassword = req.body.oldpassword;

    User.comparePassword(oldPassword, user.password, function (err, isMatch) {
        if (err)
            throw err;
        if (isMatch) {
            user.password = req.body.newpassword;
            User.updateUser(user, req.url, function (err, usermodified) {
                req.flash('success_msg', 'Your data was updated!');
                res.setHeader('Content-Type', 'application/json');
                res.redirect('/users/confirm_change');
            });
        } else {
            return done(null, false, {message: 'invalid  password'});
        }
    });
});

router.get('/account', ensureAuthenticated, function (req, res) {
    var hidden = (project.model.infoLivrare === "not") ? false : true;
    //var hidden = true;
    delete req.user.password;
    res.render('account', {display: hidden, user: req.user});
});
router.post('/account', ensureAuthenticated, function (req, res) {
    var user = req.user;
    user.name = req.body.name;
    user.surname = req.body.surmane;
    User.updateUser(user, req.url, function (err, usermodified) {
        req.flash('success_msg', 'Your data was updated!');
        res.setHeader('Content-Type', 'application/json');
        res.redirect({user: user}, '/users/account');
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
