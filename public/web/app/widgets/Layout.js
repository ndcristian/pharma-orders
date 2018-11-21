define([
    "dojo/request/xhr",
    "dojo/_base/declare",
    "dojo/promise/all",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/BorderContainer",
    "dojo/text!./templates/Layout.html",
    "app/widgets/Matches",
    "app/widgets/Teams",
    "app/widgets/Necesar",
    "app/widgets/Users",
    "app/widgets/Tournaments",
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
], function (xhr, declare, whenAll, _TemplatedMixin, _WidgetsInTemplateMixin, BorderContainer,
        template, Matches, Teams, Players, Users, Tournaments, RequestMemory, DstoreAdapter, dstore, dgrid, dateFormat, dateParse, nls,
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
        postCreate: function () {
            this.inherited(arguments);
            var self = this;

            console.log("cfg", self.cfg);

            var players = new Players({
                cfg: self.cfg,
                title: "Necesar Produse"
            });
            self.tabContainer.addChild(players);



            var tournaments = new Tournaments({
                cfg: self.cfg,
                title: "Necesar Producatori"
            });
            self.tabContainer.addChild(tournaments);


            if (self.cfg.user.rol === 'admin') {
                var users = new Users({
                    cfg: self.cfg,
                    title: "Users"
                });
                self.tabContainer.addChild(users);

                var teams = new Teams({
                    cfg: self.cfg,
                    title: "Teams"
                });
                self.tabContainer.addChild(teams);

                var matches = new Matches({
                    cfg: self.cfg,
                    title: "Matches"
                });
                self.tabContainer.addChild(matches);
            }



        } // postCreate
    });
});
