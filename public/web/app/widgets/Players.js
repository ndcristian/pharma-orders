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
                target: self.cfg.apiUrl + "/players/",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });

            self.storeusers = new dstore.RestTrackableCache({
                idProperty: '_id',
                target: self.cfg.apiUrl + "/users/",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });
            self.storetournaments = new dstore.RequestMemoryTrackable({
                idProperty: '_id',
                target: self.cfg.apiUrl + "/tournaments/",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });

            this.tournament.set('store', new DstoreAdapter(self.storetournaments));

            // define columns
            var columns = [
                {field: "name", label: "Name", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        style: "width: 100%;"
                    }
                },
                {field: "surname", label: "Surname", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        style: "width: 100%;"
                    }
                },
                {field: "email", label: "Email", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        style: "width: 100%;"
                    }
                },
                {field: "tournamentName", label: "Turneu", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        style: "width: 100%;"
                    }
                },
                {field: "points", label: "Points", className: "right", editOnClick: false, //editOn: "click",
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
            var filter = {deleted: 0};
            var grid = new dgrid.OnDmdSymmaryResizeHide({
                collection: self.store.filter(filter),
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
                var row = grid.row(evt, ).data;
                console.log("clickUpdate", row, );
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
                        tournament: self.filterForm.value.tournament,
                        tournamentName:self.tournament.displayedValue,
                        info: self.filterForm.value.info,
                        creator: self.cfg.user._id,
                        deleted: 0,
                        points: 0
                    }).then(function (item) {
                        self.grid.set('sort', 'email');
                        console.log('self.checkUser', self.checkUser);
                    });
                }
            });
            self.checkUser = {};
            this.user.on("blur", function (user) {
                self.storeusers.get(self.user.value).then(function (user) {
                    if (user.length > 0) {
                        console.log(user, user.length);
                        self.checkUser = user;
                    } else {
                        alert('User: "' + self.user.value + '" is not valid');
                    }
                });
            });

            self.tournament.subscribe("/tournaments", function (route) {
                //console.log(route);
                self.storetournaments.add(route);
                //console.log('store tournaments subscribe', self.storetournaments);
                //self.tournament.set('store', new DstoreAdapter(self.storetournaments));
            });

        } // postCreate
    });
});
