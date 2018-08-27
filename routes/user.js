var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
// User Schema

var UserSchema = mongoose.Schema({
    ids: {
        type: 'Number'
    },
    password: {
        type: 'String'
    },
    email: {
        type: 'String',
        index: true,
        unique: true
    },
    rol: {
        type: 'String'
    },
    name: {
        type: 'String'
    },
    surname: {
        type: 'String'
    }

});

var User = module.exports = mongoose.model('users', UserSchema);

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.updateUser = function (updateUser, url, callback) {
    if (url === '/account') {
        updateUser.save(callback);
    } else {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(updateUser.password, salt, function (err, hash) {
                updateUser.password = hash;
                updateUser.save(callback);
            });
        });
    }
};
module.exports.getUserByUsername = function (email, callback) {
    var query = {email: email};
    User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback) {
    User.findById(id, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err)
            throw err;
        callback(null, isMatch);
    });
};







