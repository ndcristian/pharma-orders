var nodemailer = require('nodemailer');
var mongoose = require('mongoose');

var last10fails = [];

// Fails Schema
var FailsSchema = mongoose.Schema({
    ip: {
        type: 'String',
        index: true
    },
    sessione: {
        type: 'String'
    },
    password: {
        type: 'String'
    },
    email: {
        type: 'String'
    },
    delay: {
        type: 'Number'
    },
    data: {
        type: 'Date'
    },
    active: {
        type: 'String'
    },
    tries: {
        type: 'Number'
    }
});
var fails = mongoose.model('fails', FailsSchema);
module.exports.checkFails = function (ip, sessione, email, callback) {
    fails.findOne({ip: ip}, function (err, item) {

        if (item) {
            //console.log('item', item);
            item.delay = 2222;
            item.tries = item.tries + 1;
            var failuser = new fails(item);
            //console.log('failuser from item', item);
            failuser.save(callback);
        } else {
            var failuser = new fails({
                ip: ip,
                sessione: sessione,
                password: 'notsave',
                email: email,
                data: new Date(),
                delay: 1,
                active: 0,
                tries: 1
            });
            //console.log('failuser from !item', item);
            failuser.save(callback);
        }
        ;
    });
};

// we trie to prevent user verifie for the alert ips. if there is more than 5 failed tries , we res.end() without 
// user verifie. 
module.exports.checkAlert = function (ip, fromResetPassword) {
    var founded = false;
    for (const element of last10fails) {
        //console.log('Number of fails -----', element.value);
        if (fromResetPassword) {
            if (element.ipfail === ip && element.reset > 4) {
                //console.log('Fails reach maximum -----', element.value);
                founded = true;
            }
        } else {
            if (element.ipfail === ip && element.value > 4) {
                //console.log('Fails reach maximum -----', element.value);
                founded = true;
            }
        }
    }
    return founded;
};

// we keep un array of 10 elements with last 10 fails login. we store ip adddress and increment the value 
//as number of tries. we call this function after the user is verified
module.exports.last10 = function (ip, fromReset) {
    var founded = false;
    var index = 0;
    var added = false;
    if (last10fails.length >= 10) {
        for (const element of last10fails) {
            //console.log('element-', index, element);
            if (element.ipfail === ip) {
                founded = true;
                if (!added) {
                    last10fails[index].value++;
                    if (fromReset) {
                        console.log("Intra in fromReset");
                        last10fails[index].reset++;
                        last10fails[index].value = 1;
                    }
                }
            } else {
                if (!founded && !added) {
                    added = true;
                    last10fails.splice(0, 1);
                    last10fails.push({ipfail: ip, value: 1, reset: 1});
                }
            }
            index++;
        }
    } else {
        last10fails.push({ipfail: ip, value: 1, reset: 1});
    }
};
module.exports.project = function (project) {
    var routeItems = [];

    var routes = Object.keys(project);
    routes.forEach(function (route) {
        var obj = {};
        var items = Object.keys(project[route]);
        items.forEach(function (item) {
            var value = project[route][item];
            obj[item] = value;
        });
        routeItems.push(obj);
    });
    return routeItems;
};
module.exports.checkRights = function (userRole, routeRol) {
    var rights = routeRol.split("/");
    var check = false;
    for (var right of rights) {
        //console.log('drepturile sunt:' , right );
        if (right === userRole.rol) {
            var check = true;
        }
    }
    return check;
};
module.exports.sendMail = function (user, callback) {
    var transporter = nodemailer.createTransport({
        service: 'yahoo',
        auth: {
            user: 'etixapp@yahoo.com',
            pass: 'WsplaA@2309#M'
        }
    });
    var mailOptions = {
        from: 'etixapp@yahoo.com',
        to: 'ndcristian@yahoo.co.uk',
        subject: 'BetFun - Password reset',
        text: "Hi " + user.name +
                "\n \n Your new password is: " + user.password
    };
    transporter.sendMail(mailOptions, callback);
};
// we use this function in get-get request ti eliminate from initial get request the item that was found in the 
// second get request
module.exports.removeDuplicatedItems = function (err, items, duplicateFound) {
    //????? it is a problem when no matches available
    if (duplicateFound) {
        if (duplicateFound.length > 0) {
            // creat an new array only with Ids and transform them to string to easily use indexOf
            idArray = duplicateFound.map(function (e) {
                return e.createdId.toString();
            });
            var finalResult = [];//create an array who will contain the final results to be send to the server
            // iterate through all items ( from first get request) and check if exist in array of Ids 
            items.forEach(function (item, index, array) {
                var id = item._id;
                //console.log("itemsToFind", item, '--------', idArray.indexOf(id.toString()));
                if (idArray.indexOf(id.toString()) < 0) {
                    //console.log("duplicateFound********", item, idArray.indexOf(id.toString()));
                    finalResult.push(item);
                    //**splice(index,1);** first we use splice to remove from original items array
                    //but the problem was that we affect the working array himself and the forEach loop
                    //skip the next element after found because we change the order in array
                    //console.log("duplicateFoundAfterSplice++++++++++++", items, '=======', index);
                }
            });
            return finalResult;
        } else {
            return items;
        }
    } else {
        return items;
    }

};

