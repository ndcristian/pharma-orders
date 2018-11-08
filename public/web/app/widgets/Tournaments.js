define([
    "dojo/_base/declare",
    "dojo/topic",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/BorderContainer",
    "dojo/text!./templates/Tournaments.html",
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



            // define grid store  RestSimpleQueryTrackable
            self.store = new dstore.RestTrackableCache({
                idProperty: '_id',
                target: self.cfg.apiUrl + "/tournaments/",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });

            // define columns
            var columns = [
                {field: "name", label: "Name", className: "left", editOnClick: false, //editOn: "click",
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
                {field: "datastop", label: "Stop", className: "right",
                    get: function (obj, cell) {
                        return dateFormat(new Date(obj.datastop), "date", "dd.MM.yyyy");
                    }
                },
                {field: "delete", label: "Delete", sortable: false, className: "center",
                    renderCell: function (obj, data, cell) {
                        return put("button.remove[title=Șterge] i.fa.fa-trash-o< ");
                    }
                }
            ];

            if (self.cfg.rol === 'admin') {
                var filter = {};
            } else {
                //var filter = {creator: self.cfg.user, deleted:false};
                var filter = {deleted: 0};
            }

            //Define grid
            
            var grid = new dgrid.OnDmdResize({
                collection: self.store.filter(filter),
                columns: columns,
                sort: [{property: "name", descending: false}],
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
            this.grid = grid;

            grid.on('.field-delete button.remove:click', function (evt) {

                var row = grid.row(evt).data;
                console.log('row', row);
                row.deleted = 1;
                grid.collection.put(row).then(function (item) {
                    self.grid.set('sort', '_id');
                });
            });

//            grid.on('.field-update button.update:click', function (evt) {
//                var row = grid.row(evt ).data;
//                grid.collection.put(row).then(function (item) {
//
//                });
//            });

            this.btnSave.on('click', function () {
                console.log("form value", self.filterForm.value);
                startTimeObj = timeDetails(self.filterForm.value.start);
                stopTimeObj = timeDetails(self.filterForm.value.stop);
                var start = new Date(startTimeObj.year, startTimeObj.month, startTimeObj.day, startTimeObj.hours, startTimeObj.minutes, startTimeObj.seconds, 0);
                var stop = new Date(stopTimeObj.year, stopTimeObj.month, stopTimeObj.day, stopTimeObj.hours, stopTimeObj.minutes, stopTimeObj.seconds, 0);
                self.grid.collection.add({
                    name: self.filterForm.value.name,
                    code: self.filterForm.value.name,
                    creator: self.cfg.user._id,
                    datastart: start,
                    datastop: stop,
                    deleted: 0
                }).then(function (item) {
                    self.grid.set('sort', 'datastart');
                    topic.publish("/tournaments", item);
                });
            });
            function timeDetails(selectedDate) {
                var timeObj = {};
                timeObj.day = selectedDate.getDate();
                timeObj.month = selectedDate.getMonth();
                timeObj.year = selectedDate.getFullYear();
                timeObj.hours = selectedDate.getHours();
                timeObj.minutes = selectedDate.getMinutes();
                timeObj.seconds = selectedDate.getSeconds();
                timeObj.daybefore = selectedDate.getDate() - 1;

                return timeObj;
            }


        } // postCreate
    });
});
// to display in grid that the product have or not special offer, i can try to render the server respons
//for the first 30 product and for the rest i can do this in Layout.js and change grid store after finish