define([
  "dojo/_base/declare",
  "dojo/topic",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dijit/layout/BorderContainer",
  "dojo/text!./templates/Produse.html",
  "dstore/RequestMemory",
  "dstore/legacy/DstoreAdapter",
  "util/dstore",
  "util/dgrid",
  "util/dateFormat",
  "util/dateParse",
  "dijit/form/ValidationTextBox",
  "put-selector/put"

], function(declare, topic, _TemplatedMixin, _WidgetsInTemplateMixin, BorderContainer,
  template, RequestMemory, DstoreAdapter, dstore, dgrid, dateFormat, dateParse,
  ValidationTextBox, put
) {
  return declare([
    BorderContainer, _TemplatedMixin, _WidgetsInTemplateMixin
  ], {

    templateString: template,
    year: null,
    cfg: null,
    postCreate: function() {
      this.inherited(arguments);
      var self = this;
      let produs = {};
      // define grid store
      self.store = new dstore.RestTrackable({
        idProperty: '_id',
        target: self.cfg.apiUrl + "/necesar/",
        headers: self.cfg.options.headers,
        useRangeHeaders: true
      });

      self.storeProduse = new RequestMemory({
        idProperty: 'itemid',
        target: self.cfg.apiUrl + "/produse/",
        headers: self.cfg.options.headers,
        useRangeHeaders: true
      });

      // define form input events 
      this.produse.set('store', new DstoreAdapter(self.storeProduse));
      this.produse.on('change', function(item) {
        if (item) {
          self.producator.set('value', this.item.grupproducator);
          produs = {
            produs: this.item.denumirearticol,
            producator: this.item.grupproducator,
            itemid: this.item.itemid,
            cantitate: 1
          }
        } else {
          self.producator.set('value', 'Invalid value');
        }
        self.cantitate.focus();
      });
      
      this.cantitate.on('KeyPress', function(event) {
        if (event.code === "Enter") {
          produs.cantitate = this.value;
          console.log('produs to insert ', produs)
          self.btnSave.focus();
        }
      });
      this.cantitate.set('pattern', '[0-9]+(\.[0-9]{1,2})?');

      // define columns
      var columns = [{
          field: "produs",
          label: "Produs",
          className: "left",
          editOnClick: false, //editOn: "click",
          editorArgs: {
            style: "width: 100%;"
          }
        },
        {
          field: "producator",
          label: "Producator",
          className: "left",
          editOnClick: false, //editOn: "click",
          editorArgs: {
            style: "width: 100%;"
          }
        },
        {
          field: "cantitate",
          label: "Cantitate",
          className: "left",
          editOnClick: false, //editOn: "click",
          editorArgs: {
            style: "width: 100%;"
          }
        },
        {
          field: "delete",
          label: "Delete",
          sortable: false,
          className: "center",
          renderCell: function(obj, data, cell) {
            return put("button.remove[title=Șterge] i.fa.fa-trash-o< ");
          }
        },
        {
          field: "update",
          label: "Update",
          sortable: false,
          className: "center",
          renderCell: function(obj, data, cell) {
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

      grid.on('.field-update button.update:click', function(evt) {
        var row = grid.row(evt).data;
        console.log("clickUpdate", row);
        grid.collection.put(row).then(function(item) {

        });
      });
      grid.on('.field-delete button.remove:click', function(evt) {
        var row = grid.row(evt).data;
        console.log('row', row);
        row.deleted = 1;
        grid.collection.put(row).then(function(item) {
          self.grid.set('sort', '_id');
        });
      });
      this.btnSave.on('click', function() {
        console.log(self.filterForm.validate());
        if (Object.keys(produs).length > 0 && self.filterForm.validate()) {
          console.log('produs inserted: ', produs)
          self.grid.collection.add(produs)
            .then(function(item) {
              //self.grid.set('sort', 'email');
              //console.log('self.checkUser', self.checkUser);
            });
        } else {
          alert('Formularul este invalid. Va rog verificati datele.')
        }
      });


      self.producator.subscribe("/tournaments", function(route) {
        //console.log(route);
        self.storetournaments.add(route);
        //console.log('store tournaments subscribe', self.storetournaments);
        //self.producator.set('store', new DstoreAdapter(self.storetournaments));
      });

    } // postCreate
  });
});