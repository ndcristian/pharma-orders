define([
    "dojo/_base/declare",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/BorderContainer",
    "dojo/text!./templates/Teams.html",
    "dstore/RequestMemory",
    "dstore/legacy/DstoreAdapter",
    "util/dstore",
    "util/dgrid",
    "util/dateFormat",
    "util/dateParse",
    "put-selector/put"
    
], function (declare, _TemplatedMixin, _WidgetsInTemplateMixin, BorderContainer,
        template, RequestMemory, DstoreAdapter, dstore, dgrid, dateFormat, dateParse,put
        ) {
    return declare([
        BorderContainer, _TemplatedMixin, _WidgetsInTemplateMixin
    ], {

        templateString: template,
        year: null,
        cfg: null,
        postCreate: function () {
            this.inherited(arguments);
            var self = this;

            // define grid store
            self.store = new dstore.RestTrackableCache({
                idProperty: '_id',
                target: self.cfg.apiUrl + "/teams/",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });
            // define columns
            var columns = [

                {field: "name", label: "Teams", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        selectOnClick: false,
                        //pattern: '[A-Za-z]+',
                        style: "width: 100%;"
                    }
                },
                {field: "country", label: "Country", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        selectOnClick: false,
                        //pattern: '[A-Za-z]+',
                        style: "width: 100%;"
                    }
                },

                {field: "logo", label: "Logo", className: "left",
                    editorArgs: {
                        selectOnClick: true,
                        pattern: '[0-9]+(\.[0-9]{1,2})?'
                    }
                }

            ];

            //Define grid

            var offGrid = new dgrid.OnDmdSymmaryResizeHide({
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
            this.grid = offGrid;

            //console.log("store", self.store);
            //console.log("form", self.filterForm);
            this.btnSave.on('click', function () {
                self.store.add({
                    name: self.filterForm.value.team,
                    country: self.filterForm.value.country,
                    logo: self.filterForm.value.logo
                }).then(function (item) {
                    self.grid.set('sort', 'name');
                });

            });
        }
    });
});
// to display in grid that the product have or not special offer, i can try to render the server respons
//for the first 30 product and for the rest i can do this in Layout.js and change grid store after finish