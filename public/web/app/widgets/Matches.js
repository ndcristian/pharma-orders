define([
    "dojo/_base/declare",
    "dojo/promise/all",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/BorderContainer",
    "dojo/text!./templates/Matches.html",
    "dstore/RequestMemory",
    "dstore/legacy/DstoreAdapter",
    "util/dstore",
    "util/dgrid",
    "util/dateFormat",
    "util/dateParse",
    "dijit/form/ValidationTextBox",
    "put-selector/put"
   
], function (declare, whenAll, _TemplatedMixin, _WidgetsInTemplateMixin, BorderContainer,
        template, RequestMemory, DstoreAdapter, dstore, dgrid, dateFormat, dateParse,
        ValidationTextBox,  put
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



            // define grid store  RestSimpleQueryTrackable
            self.storematches = new dstore.RestTrackableCache({
                idProperty: '_id',
                target: self.cfg.apiUrl + "/match/",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });
            self.storeteam = new RequestMemory({
                idProperty: '_id',
                target: self.cfg.apiUrl + "/teams/",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });
            this.team1.set('store', new DstoreAdapter(self.storeteam));
            this.team2.set('store', new DstoreAdapter(self.storeteam));


            // define columns
            var columns = [

                {field: "team1", label: "Team1", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        style: "width: 100%;"
                    }
                },
                {field: "team2", label: "Team2", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        style: "width: 100%;"
                    }
                },
                {field: "datastart", label: "Start", className: "right",
                    get: function (obj, cell) {
//                        console.log('OBJ', obj, cell);
                        return dateFormat(new Date(obj.datastart), "date", "dd.MM.yyyy");
                    }
                },
                {field: "datastartbet", label: "DataBet", className: "right",
                    get: function (obj, cell) {
                        return dateFormat(new Date(obj.datastartbet), "date", "dd.MM.yyyy");
                    }
                },
                {field: "orastart", label: "Ora", className: "right",
                    get: function (obj, cell) {
                        return dateFormat(new Date(obj.orastart), "time", "H:m:s");
                    }},
                {field: "gol1", label: "Gol1", className: "right", autoSave: true,
                    editorArgs: {
                        selectOnClick: true,
                        pattern: '[0-9]+(\.[0-9]{1,2})?'
                    },
                    editor: ValidationTextBox
                },
                {field: "gol2", label: "Gol2", className: "right", autoSave: true,
                    editorArgs: {
                        selectOnClick: true,
                        pattern: '[0-9]+(\.[0-9]{1,2})?'
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

            var matchGrid = new dgrid.OnDmdResize({
                collection: self.storematches,
                columns: columns,
                sort: [{property: "datastart", descending: false}],
                selectionMode: "none",
                getBeforePut: false,
                cellNavigation: false,
                noDataMessage: "Nu există date",
                loadingMessage: "Se încarcă ...",
                pagingLinks: false,
                pagingTextBox: true,
                firstLastArrows: true,
                rowsPerPage: 10,
                pageSizeOptions: [10, 15, 30]
            }, this.gridplace);
            this.grid = matchGrid;

            matchGrid.on('.field-delete button.remove:click', function (evt) {

                var row = matchGrid.row(evt).data;
                console.log("clickDelete", row);
                matchGrid.collection.remove(row._id).then(function (item) {
                    console.log('then item', item);
                    self.grid.set('sort', '_id');
                });
            });

            matchGrid.on('.field-update button.update:click', function (evt) {

                var row = matchGrid.row(evt, ).data;
                console.log("clickUpdate", row, );
                matchGrid.collection.put(row).then(function (item) {

                });
            });

            this.btnSave.on('click', function () {
                dateTimeObj = timeDetails(self.filterForm.value.data);
                var selectedDate = new Date(dateTimeObj.year, dateTimeObj.month, dateTimeObj.day, dateTimeObj.hours, dateTimeObj.minutes, dateTimeObj.seconds, 0);
                var dateBefore = new Date(dateTimeObj.year, dateTimeObj.month, dateTimeObj.day - 1, dateTimeObj.hours, dateTimeObj.minutes, dateTimeObj.seconds, 0);
                var dateBeforeMidNight = new Date(dateTimeObj.year, dateTimeObj.month, dateTimeObj.day - 1, 0, 0, 0, 0);
                self.grid.collection.add({
                    team1: self.team1.displayedValue,
                    team2: self.team2.displayedValue,
                    idteam1: self.filterForm.value.team1,
                    idteam2: self.filterForm.value.team2,
                    datastart: selectedDate,
                    orastart: selectedDate,
                    datastartbet: dateBeforeMidNight,
                    datastopbet: selectedDate,
                    gol1: "",
                    gol2: ""
                }).then(function (item) {
                    console.log('dstore', self.storematches);
                    console.log('Self', self);
                    self.grid.set('sort', 'datastart');
                });
            });
            function timeDetails(selectedDate) {
                var timeObj = {};
                timeObj.day = self.filterForm.value.data.getDate();
                timeObj.month = self.filterForm.value.data.getMonth();
                timeObj.year = self.filterForm.value.data.getFullYear();
                timeObj.hours = self.filterForm.value.ora.getHours();
                timeObj.minutes = self.filterForm.value.ora.getMinutes();
                timeObj.seconds = self.filterForm.value.ora.getSeconds();
                timeObj.daybefore = self.filterForm.value.data.getDate() - 1;

                return timeObj;
            }


        } // postCreate
    });
});
// to display in grid that the product have or not special offer, i can try to render the server respons
//for the first 30 product and for the rest i can do this in Layout.js and change grid store after finish