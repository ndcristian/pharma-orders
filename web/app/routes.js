/* routes is generated autoamte from route models.js

 */
var express = require('express');
var router = express.Router();

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

