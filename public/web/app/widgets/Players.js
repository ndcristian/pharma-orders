define([
    "dojo/_base/declare",
    "dojo/topic",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/BorderContainer",
    "dojo/text!./templates/Players.html",
    "dstore/RequestMemory",
    "dstore/legacy/DstoreAdapter",
    "util/dstore",
    "util/dgrid",
    "util/dateFormat",
    "util/dateParse",
    "dijit/form/ValidationTextBox",
    "put-selector/put"

], function (declare, topic, _TemplatedMixin, _WidgetsInTemplateMixin, BorderContainer,
        template, RequestMemory, DstoreAdapter, dstore, dgrid, dateFormat, dateParse,
        ValidationTextBox, put
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
                target: self.cfg.apiUrl + "/nomenclatorAA/",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });

            self.storeproduse = new dstore.RestTrackableCache({
                idProperty: '_id',
                target: self.cfg.apiUrl + "/nomenclator/produs",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });
            self.storetournaments = new dstore.RequestMemoryTrackable({
                idProperty: '_id',
                target: self.cfg.apiUrl + "/tournaments/",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });

            this.produse.set('store', new DstoreAdapter(self.storeproduse));

            // define columns
            var columns = [
                {field: "denumirearticol", label: "Produs", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        style: "width: 100%;"
                    }
                },
                {field: "grupproducator", label: "Producator", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        style: "width: 100%;"
                    }
                },
                {field: "dci", label: "DCI", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        style: "width: 100%;"
                    }
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
            var filter = {};
            var grid = new dgrid.OnDmdSymmaryResizeHide({
                collection: self.store,
                columns: columns,
//                 sort: [{property: "denumirearticol", descending: false}],
               
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

//            grid.on('.field-delete button.remove:click', function (evt) {
//
//                var row = grid.row(evt).data;
//                console.log("clickDelete", row);
//                grid.collection.remove(row._id).then(function (item) {
//                    console.log('then item', item);
//                    self.grid.set('sort', '_id');
//                });
//            });

            grid.on('.field-update button.update:click', function (evt) {
                var row = grid.row(evt ).data;
                console.log("clickUpdate", row );
                grid.collection.put(row).then(function (item) {

                });
            });
            grid.on('.field-delete button.remove:click', function (evt) {
                var row = grid.row(evt).data;
                console.log('row', row);
                row.deleted = 1;
                grid.collection.put(row).then(function (item) {
                    self.grid.set('sort', '_id');
                });
            });
            this.btnSave.on('click', function () {
                if (self.checkUser.length === 1) {
                    self.grid.collection.add({
                        name: self.checkUser[0].name,
                        surname: self.checkUser[0].surname,
                        email: self.checkUser[0].email,
                        playerId: self.checkUser[0]._id,
                        tournament: self.filterForm.value.producator,
                        tournamentName:self.producator.displayedValue,
                        info: self.filterForm.value.info,
                        creator: self.cfg.produs._id,
                        deleted: 0,
                        points: 0
                    }).then(function (item) {
                        self.grid.set('sort', 'email');
                        console.log('self.checkUser', self.checkUser);
                    });
                }
            });
            

            self.producator.subscribe("/tournaments", function (route) {
                //console.log(route);
                self.storetournaments.add(route);
                //console.log('store tournaments subscribe', self.storetournaments);
                //self.producator.set('store', new DstoreAdapter(self.storetournaments));
            });

        } // postCreate
    });
});
