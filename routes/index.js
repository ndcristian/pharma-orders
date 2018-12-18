var express = require('express');
var router = express.Router();
var fs = require('fs');
//Get home page
router.get('/', function(req, res) {
  res.render('index');
  //res.render('index');
});
router.get('/main', ensureAuthenticated, function(req, res) {
  //console.log ('From index.js /main res.locals is: ', res.locals);
  res.render('main', {
    locals: res.locals
  });
});

router.get('/req', function(req, res) {
  fs.writeFile('./models/req.json', req, function(err) {
    if (err) {
      return console.log(err);
    }
  });
  res.redirect('/main');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash('error_msg', 'You are not logged in');
    res.redirect('/users/login');
  }
}


module.exports = router;