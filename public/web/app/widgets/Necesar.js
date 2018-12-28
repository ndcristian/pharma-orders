define([
  "dojo/_base/declare",
  "dojo/topic",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dijit/layout/BorderContainer",
  "dojo/text!./templates/Necesar.html",
  "dstore/RequestMemory",
  "dstore/legacy/DstoreAdapter",
  "util/dstore",
  "util/dgrid",
  "util/dateFormat",
  "util/dateParse",
  "dijit/form/ValidationTextBox",
  "dijit/form/Textarea",
  "put-selector/put"
], function(declare, topic, _TemplatedMixin, _WidgetsInTemplateMixin, BorderContainer,
  template, RequestMemory, DstoreAdapter, dstore, dgrid, dateFormat, dateParse,
  ValidationTextBox, Textarea, put
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
      let produs = {
        cui: self.cfg.user.cui,
        pl: self.cfg.user.pl
      };
      console.log('produs: ', produs);


      // define form input events 
      this.produse.set('store', new DstoreAdapter(self.cfg.Produse));
      this.produse.on('change', function(item) {
        if (item) {
          var itemSelected = this.item;
          self.producator.set('value', this.item.grupproducator);
          self.cfg.Oferte.get(itemSelected.denumirearticol).then(function(oferta) {
            produs.produs = itemSelected.denumirearticol;
            produs.producator = itemSelected.grupproducator;
            produs.dci = itemSelected.dci;
            produs.itemid = itemSelected.itemid;
            produs.cantitate = 1;
            produs.oferta = oferta;
            produs.observatii = "";
            produs.activ = true;
          });
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
          field: "dci",
          label: "DCI",
          className: "left",
          editOnClick: false, //editOn: "click",
          editorArgs: {
            style: "width: 100%;"
          }
        },
        {
          field: "cantitate",
          label: "Cantitate",
          className: "right",
          editOnClick: false, //editOn: "click",
          editorArgs: {
            style: "width: 100%;"
          }
        },
        {
          field: "observatii",
          label: "Observatii",
          autoSave: true,
          className: "left",
          editOnClick: true, //editOn: "click",
          editorArgs: {
            selectOnClick: true,
            style: "width: 100%;"
          },
          editor: Textarea
        },
        //         {
        //           field: "oferta",
        //           label: "Oferta",
        //           className: "right",
        //           editOnClick: false, //editOn: "click",
        //           editorArgs: {
        //             style: "width: 100%;"
        //           },
        //           renderCell: function(item, value, node, options) {

        //             if (item.oferta && item.oferta.length > 0) {
        //               console.log("item", item, "value", value, "node", node, "options", options);
        //               //return put ("span.remove[title=OS] i.fa.fa-percent<");    
        //               return put(node, "div", item.oferta[0].numeoferta);
        //             }
        //           }
        //         },
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
        collection: self.cfg.Necesar.filter({activ:true, pl:self.cfg.user.pl}),
        columns: columns,
        sort: [{
          property: "produs",
          descending: false
        }],
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
        //row.deleted = 1;
        grid.collection.remove(row._id).then(function(item) {
          //self.grid.set('sort', '_id');
        });
      });
      this.btnSave.on('click', function() {
        console.log(self.filterForm.validate());
        if (Object.keys(produs).length > 0 && self.filterForm.validate()) {
          produs.cantitate = self.cantitate.value;
          console.log('produs inserted: ', produs);
          console.log('Object Key produs', Object.keys(produs))
          self.grid.collection.add(produs)
            .then(function(item) {
              //self.grid.set('sort', 'email');
              //console.log('self.checkUser', self.checkUser);
              console.log('btnsaveClick item is: ', item);
              if (item.error) {
                alert("You are not Logged in. Press F5 to redirect to login page")
              }
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