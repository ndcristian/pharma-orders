// this function parse the project json file and return the propreties of the project
module.exports.project = function(project) {
  var routeItems = [];

  var routes = Object.keys(project);
  routes.forEach(function(route) {
    var obj = {};
    var items = Object.keys(project[route]);
    items.forEach(function(item) {
      var value = project[route][item];
      obj[item] = value;
    });
    routeItems.push(obj);
  });
  return routeItems;
};


// used to parse query. query - res.query. user - res.user fieldToFilterUser - from project and represents the field 
//from database that indicate the user to filter for . If user=admin we don't use filter on userId because 
// the admin  see all 
module.exports.queryparse = function(query, user) {
  var queryItems = {
    query: {},
    sort: {}
  };
  var queryObj = Object.keys(query);
  queryObj.forEach(function(key, value) {
    console.log('query', query);
    if (/sort/i.test(key)) {
      var res = key.match(/sort\((.*?)\)/);
      var fieldname = res[1].replace(/\W/g, '');
      console.log ('**from app/controls fieldname este: ', fieldname);
      var order = res[1].match(/-/) ? -1 : 1;
      console.log ('**from app/controls order este: ', fieldname);
      var sort = {
        [fieldname]: order
      };
      queryItems.sort = sort;
    } else {
      queryItems['query'][key] = query[key];
      //test if value contains numbers and format query as number. defaul value is string "1234"
      if (/^\d+$/.test(query[key])) {
        queryItems['query'][key] = +query[key];
      }
      // test if boolean and set data as boolean. default value is string "true" or "false"
      if (/true/i.test(query[key])) {

        queryItems['query'][key] = true;
      }
      if (/false/i.test(query[key])) {

        queryItems['query'][key] = false;
      }
    }
  });
  return queryItems;
};


module.exports.checkRights = function(userRole, routeRol) {
  if (routeRol.includes(userRole.rol)) {
    return true;
  } else {
    return false;
  }
};




module.exports.sendMail = function(user, callback) {
  var nodemailer = require('nodemailer');

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