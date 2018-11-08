/*jshint unused:false*/
var dojoConfig = {
    async: true,
    baseUrl: '.',
    tlmSiblingOfDojo: false,
    isDebug: true,
    locale: 'ro',
    packages: [
        {name: "dojo", location: "../vendors/dojo"},
        {name: "dijit", location: "../vendors/dijit"},
        {name: "dmodel", location: "../vendors/dmodel"},
        {name: "dojox", location: "../vendors/dojox"},
        {name: "themes", location: "../vendors/dojo-themes"},
        {name: "dgrid", location: "../vendors/dgrid"},
        {name: "dstore", location: "../vendors/dstore"},
        {name: "put-selector", location: "../vendors/put-selector"},
        {name: "util", location: "../vendors/wsx-dojo-util"},
        {name: "app", location: "../web/app"}
    ],
    deps: ['app']

};
