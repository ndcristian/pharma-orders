define([
    "dojo/_base/declare",
    "dojo/promise/all",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/BorderContainer",
    "dojo/text!./templates/Users.html",
    "dstore/RequestMemory",
    "dstore/legacy/DstoreAdapter",
    "util/dstore",
    "util/dgrid",
    "util/dateFormat",
    "util/dateParse",
    "dojo/i18n!./nls/Layout",
    "dijit/form/FilteringSelect",
    "dijit/form/ValidationTextBox",
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
], function (declare, whenAll, _TemplatedMixin, _WidgetsInTemplateMixin, BorderContainer,
        template, RequestMemory, DstoreAdapter, dstore, dgrid, dateFormat, dateParse, nls,
        FilteringSelect, ValidationTextBox, Form, Button, put, on, dom, parser, domConstruct, html, ready
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

            // define grid store
            self.store = new dstore.RestTrackableCache({
                idProperty: '_id',
                target: self.cfg.apiUrl + "/users/",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });
            // define columns
            var columns = [

                {field: "name", label: "Name", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        selectOnClick: false,
                        //pattern: '[A-Za-z]+',
                        style: "width: 100%;"
                    }
                },
                {field: "surname", label: "Surname", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        selectOnClick: false,
                        //pattern: '[A-Za-z]+',
                        style: "width: 100%;"
                    }
                },

                {field: "email", label: "Email", className: "left",
                    editorArgs: {
                        selectOnClick: true
                        //pattern: '[0-9]+(\.[0-9]{1,2})?'
                    }
                },
                {field: "rol", label: "Rol", className: "center", autoSave: true,
                    editorArgs: {
                        selectOnClick: true,
                        pattern: '[A-Za-z]+'
                    },
                    editor: ValidationTextBox
                },
              {field: "cui", label: "CUI", className: "center", autoSave: true,
                    editorArgs: {
                        selectOnClick: true,
                        //pattern: '[A-Za-z]+'
                    },
                    editor: ValidationTextBox
                },
              {field: "pl", label: "PunctVanzare", className: "center", autoSave: true,
                    editorArgs: {
                        selectOnClick: true,
                       // pattern: '[A-Za-z]+'
                    },
                    editor: ValidationTextBox
                },
                {field: "delete", label: "Delete", sortable: false, className: "center",

                    renderCell: function (obj, data, cell) {
                        return put("button.remove[title=Șterge] i.fa.fa-trash-o< ");

                    }
                },
                {field: "update", label: "Update", sortable: false, className: "center",

                    renderCell: function (obj, data, cell) {
                        return put("button.update[title=Șterge] i.fa.fa-refresh< ");

                    }
                }
            ];

            //Define grid

            var grid = new dgrid.OnDmdSymmaryResizeHide({
                collection: self.store,
                columns: columns,
                sort: [{property: "name", descending: false}],
                selectionMode: "single",
                getBeforePut: false,
                cellNavigation: false,
                noDataMessage: "Nu există date",
                loadingMessage: "Se încarcă ...",
                pagingLinks: false,
                pagingTextBox: true,
                firstLastArrows: true,
                rowsPerPage: 20,
                pageSizeOptions: [10, 20]
            }, this.gridplace);
            this.grid = grid;
         
            grid.on('.field-delete button.remove:click', function (evt) {

                var row = grid.row(evt).data;
                console.log("clickDelete", row);
                grid.collection.remove(row._id).then(function (item) {
                    console.log('then item', item);
                    self.grid.set('sort', '_id');
                });
            });

            grid.on('.field-update button.update:click', function (evt) {
                var row = grid.row(evt).data;
                console.log("clickUpdate", row);
                grid.collection.put(row).then(function (item) {

                });
            });
            
            this.btnSave.on('click', function () {
                self.store.add({
                    name:self.filterForm.value.name,
                    surname:self.filterForm.value.surname,
                    email:self.filterForm.value.email,
                    rol:self.filterForm.value.rol
                }).then(function (item) {
                    self.grid.set('sort', 'name');
                });
                
            });
        }
    });
});
// to display in grid that the product have or not special offer, i can try to render the server respons
//for the first 30 product and for the rest i can do this in Layout.js and change grid store after finish