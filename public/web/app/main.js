define([
    './widgets/Layout', // se incarca fisierul layout.js care incarca layout.html
    "./config", // se incarca fisierul config.js
    'dojo/domReady!'
], function (Layout, cfg) {
    var app = {};
  var url = '/api/inf/'
//    app.layout = new Layout({year: (new Date()).getFullYear(), cfg: cfg}).placeAt(document.body);
//    app.layout.startup();
    getUser(url, function (res) {
        //cfg["user"] = JSON.parse(res.response)._id;
        //cfg["rol"] = JSON.parse(res.response).rol;
      console.log(res);
        cfg["user"] = JSON.parse(res.response);
        cfg["user"]["password"] = "";
        app.layout = new Layout({year: (new Date()).getFullYear(), cfg: cfg}).placeAt(document.body);
        app.layout.startup();
    });
    return app;
});

// functia face un request pe o ruta si aduce toate headerele
function getUser(url, callback) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onreadystatechange = function (x) {
        if (this.readyState == 4 && this.status == 200) {
            callback(this);
        }
    };
};
