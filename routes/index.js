var express = require('express');
var router = express.Router();
var fs = require('fs') ;
//Get home page
router.get('/', function (req, res) {
  console.log ('locals',res.locals.appName)
    res.render('index', { name: res.locals.appName, title:'React starter', appName:res.locals.appName});
    //res.render('index');
});
router.get('/main',ensureAuthenticated, function (req, res) {
    
    res.render('main');
});



router.get('/req', function (req,res){
  fs.writeFile('./models/req.json', req , function(err){
   if (err){
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
