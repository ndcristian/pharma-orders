define([
  "dojo/request/xhr",
  "dojo/_base/declare",
  "dojo/promise/all",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dijit/layout/BorderContainer",
  "dojo/text!./templates/Layout.html",
  "app/widgets/Necesar",
  "app/widgets/Comanda",
  "app/widgets/Restricted",
  "app/widgets/Users",
  "dstore/RequestMemory",
  "dstore/legacy/DstoreAdapter",
  "util/dstore",
  "util/dgrid",
  "util/dateFormat",
  "util/dateParse",
  "dojo/i18n!./nls/Layout",
  "dijit/form/FilteringSelect",
  "dijit/form/ValidationTextBox",
  "dijit/form/ComboBox",
  "dijit/form/RadioButton",
  "dijit/form/DateTextBox",
  "dijit/form/TimeTextBox",
  "dijit/form/Form",
  "dijit/form/Button",
  "put-selector/put",
  "dojo/on",
  "dojo/dom",
  "dojo/parser",
  "dojo/dom-construct",
  "dojo/html",
  "dojo/ready",
  "dojo/domReady!",
  "dijit/layout/TabContainer",
  "dijit/layout/ContentPane"
], function(xhr, declare, whenAll, _TemplatedMixin, _WidgetsInTemplateMixin, BorderContainer,
  template, Necesar, Comanda, Restricted, Users, RequestMemory, DstoreAdapter, dstore, dgrid, dateFormat, dateParse, nls,
  FilteringSelect, ValidationTextBox, ComboBox, RadioButton, DateTextBox, TimeTextBox, Form, Button, put,
  on, dom, parser, domConstruct, html, ready
) {
  return declare([
    BorderContainer, _TemplatedMixin, _WidgetsInTemplateMixin
  ], {

    templateString: template,
    nls: nls,
    year: null,
    cfg: null,
    postCreate: function() {
      this.inherited(arguments);
      var self = this;

      self.cfg.Produse = new RequestMemory({
        idProperty: 'itemid',
        target: self.cfg.apiUrl + "/produse/",
        headers: self.cfg.options.headers,
        useRangeHeaders: true
      });
      self.cfg.Oferte = new RequestMemory({
        idProperty: 'id',
        target: self.cfg.apiUrl + "/oferte/",
        headers: self.cfg.options.headers,
        useRangeHeaders: true
      });
      self.cfg.Comanda = new dstore.RestTrackable({
        idProperty: '_id',
        target: self.cfg.apiUrl + "/comanda/",
        headers: self.cfg.options.headers,
        useRangeHeaders: true
      });
      self.cfg.Necesar = new dstore.RestTrackable({
        idProperty: '_id',
        target: self.cfg.apiUrl + "/necesar/",
        headers: self.cfg.options.headers,
        useRangeHeaders: true
      });
      self.cfg.Comanda = new dstore.RestTrackable({
        idProperty: '_id',
        target: self.cfg.apiUrl + "/comanda/",
        headers: self.cfg.options.headers,
        useRangeHeaders: true
      });
      self.cfg.Users = new RequestMemory({
        idProperty: '_id',
        target: self.cfg.apiUrl + "/users/?cui=" + (+self.cfg.user.cui),
        headers: self.cfg.options.headers,
        useRangeHeaders: true
      });
      self.cfg.Producatori = new RequestMemory({
        idProperty: 'id',
        target: self.cfg.apiUrl + "/producatori/",
        headers: self.cfg.options.headers,
        useRangeHeaders: true
      });

      if (self.cfg.user.rol == "restricted") {
        var players = new Restricted({
          cfg: self.cfg,
          title: "Restricted"
        });
        self.tabContainer.addChild(players);
      }

      if (self.cfg.user.rol == "admin" || self.cfg.user.rol == "power" || self.cfg.user.rol == "root") {
        var necesar = new Necesar({
          cfg: self.cfg,
          title: "Necesar Produse"
        });
        self.tabContainer.addChild(necesar);
      }

      console.log("cfg", self.cfg);

      if (self.cfg.user.rol == "admin" || self.cfg.user.rol == "root") {
        var comanda = new Comanda({
          cfg: self.cfg,
          title: "Comanda"
        });
        self.tabContainer.addChild(comanda);
      }
      
      if (self.cfg.user.rol == "root") {
        var users = new Users({
          cfg: self.cfg,
          title: "Users"
        });
        self.tabContainer.addChild(users);
      }

    } // postCreate
  });
});