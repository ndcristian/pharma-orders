define([
  "dojo/_base/declare",
  "dojo/topic",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dijit/layout/BorderContainer",
  "dojo/text!./templates/Comanda.html",
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
      this.pos.set('store', new DstoreAdapter(self.cfg.Users));
      this.producator.set('store', new DstoreAdapter(self.cfg.Producatori));
      this.produse.on('change', function(item) {
        if (item) {

        } else {

        }

      });

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
          field: "lastPrice",
          label: "Pret",
          className: "right",
          editOnClick: true, //editOn: "click",
          autoSave: true,
          editorArgs: {
            selectOnClick: true,
            style: "width: 100%;"
          },
           editor: Textarea
        },
          {
          field: "lastDiscount",
          label: "Discount",
          className: "right",
          autoSave: true,
          editOnClick: true, //editOn: "click",
          editorArgs: {
            selectOnClick: true,
            style: "width: 100%;"
          },
             editor: Textarea
        },           
        {
          field: "cantitate",
          label: "Cantitate",
          className: "right",
          autoSave: true,
          editOnClick: false, //editOn: "click",
          editorArgs: {
            selectOnClick: true,
            style: "width: 100%;"
          },
           editor: Textarea
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

      var grid = new dgrid.OnDmdSymmaryResizeHide({
        collection: self.cfg.Necesar.filter({
          activ: true,
          cui: self.cfg.user.cui
        }),
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
        // pagingLinks: false,
        // pagingTextBox: true,
        firstLastArrows: true,
        //rowsPerPage: 20,
        // pageSizeOptions: [10, 20]
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

      self.producator.subscribe("/tournaments", function(route) {
        //console.log(route);
        self.storetournaments.add(route);
        //console.log('store tournaments subscribe', self.storetournaments);
        //self.producator.set('store', new DstoreAdapter(self.storetournaments));
      });

    } // postCreate
  });
});