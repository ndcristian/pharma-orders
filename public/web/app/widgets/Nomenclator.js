define([
    "dojo/_base/declare",
    "dojo/promise/all",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/BorderContainer",
    "dojo/text!./templates/Oferta.html",
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
            self.store = new RequestMemory({
                idProperty: 'itemid',
                target: self.cfg.apiUrl + "/nomenclator/",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });
            // define columns
            var columns = [

                {field: "numeprodus", label: "Nume Produs", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        selectOnClick: false,
                        //pattern: '[A-Za-z]+',
                        style: "width: 100%;"
                    }
                },
                {field: "furnizor", label: "Furnizor", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        selectOnClick: false,
                        //pattern: '[A-Za-z]+',
                        style: "width: 100%;"
                    }
                },

                {field: "pretvanzaref", label: "Pret Vanzare", className: "right",
                    editorArgs: {
                        selectOnClick: true,
                        pattern: '[0-9]+(\.[0-9]{1,2})?'
                    }

                },
                {field: "bbd", label: "Expir", className: "right",
                    editorArgs: {
                        selectOnClick: true,
                        pattern: '[0-9]+(\.[0-9]{1,2})?'
                    }

                },
                {field: "cantitate", label: "Cantitate", autoSave: true,
                    editorArgs: {
                        selectOnClick: true,
                        pattern: '[0-9]+(\.[0-9]{1,2})?',
                        style: "width: 100%; height:70%;"
                    },
                    editor: ValidationTextBox
                }

            ];

            //Define grid

            var offGrid = new dgrid.PaginationResizeHide({
                collection: self.store,
                columns: columns,
                sort: [{property: "numeprodus", descending: false}],
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
            }, this.gridOferta);
            this.grid = offGrid;

            
        }
    });
});
// to display in grid that the product have or not special offer, i can try to render the server respons
//for the first 30 product and for the rest i can do this in Layout.js and change grid store after finish