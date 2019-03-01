define([
  "dojo/_base/declare",
  "dojo/topic",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dijit/layout/BorderContainer",
  "dojo/text!./templates/Istoric.html",
  "dstore/RequestMemory",
  "dstore/Memory",
  "dstore/legacy/DstoreAdapter",
  "util/dstore",
  "util/dgrid",
  "util/dateFormat",
  "util/dateParse",
  "dijit/form/ValidationTextBox",
  "dijit/form/Textarea",
  "put-selector/put"
], function(declare, topic, _TemplatedMixin, _WidgetsInTemplateMixin, BorderContainer,
  template, RequestMemory, Memory, DstoreAdapter, dstore, dgrid, dateFormat, dateParse,
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
      var produsSelected = {
        produs: "none"
      };

      // define form input events 
      this.produse.set('store', new DstoreAdapter(self.cfg.Produse));
      this.pos.set('store', new DstoreAdapter(self.cfg.Users));
      this.producator.set('store', new DstoreAdapter(self.cfg.Producatori));
      this.distribuitor.set('store', new DstoreAdapter(self.cfg.Furnizori));
      this.distribuitor.set('value', 4);

      this.distribuitor.on('change', function(item) {
        console.log('item on change distrib', item, self.distribuitor.get('displayedValue'))
        if (item) {
          console.log('item in produse on change', item);
          self.grid.set('collection', self.cfg.Istoric.filter({
            furnizor: self.distribuitor.get('displayedValue')
          }))

        }
      });

      this.produse.on('change', function(item) {
        console.log('item in produse on change', item, self.produse.get('displayedValue'));
        if (item) {
          console.log('item in produse on change', item);
          self.grid.set('collection', self.cfg.Istoric.filter({
            produs: self.produse.get('displayedValue')
          }))

        }
      });
      this.producator.on('change', function(item, x) {
        console.log('item in produse on change', item, self.producator.get('displayedValue'));
        if (item) {
          self.grid.set('collection', self.cfg.Istoric.filter({
            producator: self.producator.get('displayedValue')
          }))

        }
      });

      // define columns
      var columns = [{
          field: "produs",
          label: "Produs",
          className: "left",
          editorArgs: {
            style: "width: 100%;"
          }
        },
        {
          field: "producator",
          label: "Producator",
          className: "left",
          editorArgs: {
            style: "width: 100%;"
          }
        },
        {
          field: "furnizor",
          label: "Furnizor",
          className: "left",
          editorArgs: {
            style: "width: 100%;"
          }
        },
        {
          field: "lastPrice",
          label: "Pret",
          className: "right",
          formatter: dgrid.cell.formatter.n2,
          editorArgs: {

            pattern: '[0-9]+(\.[0-9]{1,2})?',
            style: "width: 100%;"
          },

        },
        {
          field: "lastDiscount",
          label: "Discount",
          className: "right",
          formatter: dgrid.cell.formatter.percent,
          editorArgs: {
            pattern: '[0-9]+(\.[0-9]{1,2})?',
            style: "width: 100%;"
          },

        },

        {
          field: "lastFinalPret",
          label: "PretRedus",
          className: "right",
          formatter: dgrid.cell.formatter.n2,
        },
        {
          field: "cantitate",
          label: "Necesar",
          className: "right",
          editorArgs: {
            pattern: '[0-9]+(\.[0-9]{1,2})?',
            style: "width: 100%;"
          },

        },
        {
          field: "comanda",
          label: "Comanda",
          className: "right",
          editorArgs: {
            pattern: '[0-9]+(\.[0-9]{1,2})?',
            style: "width: 100%;"
          },

        },
        {
          field: "date",
          label: "Data",
          className: "right",
          get: function(obj, cell) {
            console.log('OBJ', obj, cell);
            return dateFormat(new Date(obj.date), "dd.MM.yyyy");
          },
          editorArgs: {
            pattern: '[0-9]+(\.[0-9]{1,2})?',
            style: "width: 100%;"
          },

        },
        {
          field: "observatii",
          label: "Observatii",
          className: "left",
          editorArgs: {
            style: "width: 100%;"
          },

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
        
      ];

      //Define grid

      var grid = new dgrid.OnDmdSymmaryResizeHide({
        collection: self.cfg.Istoric,
        columns: columns,
        sort: [{
          property: "date",
          descending: true
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


//       grid.on('dgrid-datachange', function(event) {
//         console.log("event", event);
//         var row = event.cell.row.data;
//         console.log("row before", row);

//         //event.cell.row.data.lastFinalPret = (+event.cell.row.data.lastPrice) * (1- (+event.cell.row.data.lastDiscount/100));
//         if (event.cell.column.field === "lastDiscount" || event.cell.column.field === "lastPrice") {
//           console.log("field selected");
//           row.lastDiscount = event.cell.column.field === "lastDiscount" ? event.value : row.lastDiscount;
//           row.lastPrice = event.cell.column.field === "lastPrice" ? event.value : row.lastPrice;
//           row.lastFinalPret = (+row.lastPrice) * (1 - (+row.lastDiscount) / 100);
//           //self.cfg.Conditii.add().then(function(){})
//         }

//       })

      grid.on('dgrid-select', function(selectedProd) {
        console.log('selected prod este :', selectedProd.rows[0].data.detalii);
        produsSelected = selectedProd.rows[0].data.produs;
        console.log(produsSelected);
        //var selectedProdArray = [{pl:'PL1', cantitate:20},{pl:'PL2', cantitate:40}];
         var selectedProdArray =selectedProd.rows[0].data.detalii;
//         selectedProd.rows[0].data.detalii.forEach(function(productsArray) {
//           selectedProdArray.push(productsArray); 
//         })
        
        
        
        
        
        
        
        console.log("ARRAY", selectedProdArray);
        self.gridfarmacii.set('collection', new Memory({
          data: selectedProdArray,
          idProperty: "pl"
        }))
      });

      grid.on('.field-comandat button.comandat:click', function(evt) {
        var row = grid.row(evt).data;
        delete row._id;
        console.log("clickUpdate", row);

        self.cfg.Istoric.add(row).then(function(item) {
          console.log("item comandat", item);
        })
        //grid.collectin.remove(row._id);

        //         grid.collection.put(row).then(function(item) {

        //         });
      });
      grid.on('.field-delete button.remove:click', function(evt) {
        var row = grid.row(evt).data;
        console.log('row', row);
        //row.deleted = 1;
        grid.collection.remove(row._id).then(function(item) {
          //self.grid.set('sort', '_id');
        });
      });

      this.btnRefresh.on('click', function() {
        self.grid.set('collection', self.cfg.Istoric.filter({}).sort('date'));
      })

      //***********-Define grid in Farmacii details

      var columnsFarmacii = [{
          field: "pl",
          label: "Farmacia",
          autoSave: true,
          className: "left",
          editOnClick: true, //editOn: "click",
          editorArgs: {
            selectOnClick: true,
            style: "width: 100%;"
          },
        },
        {
          field: "cantitate",
          label: "Cantitate",
          autoSave: true,
          className: "left",
          editOnClick: true, //editOn: "click",
          editorArgs: {
            selectOnClick: true,
            style: "width: 100%;"
          }
        }, {
          field: "observatii",
          label: "Observatii",
          autoSave: true,
          className: "left",
          editOnClick: true, //editOn: "click",
          editorArgs: {
            selectOnClick: true,
            style: "width: 100%;"
          },
        }
      ]
      var gridFarmacii = new dgrid.OnDmdSymmaryResizeHide({
        collection: self.cfg.Necesar.filter({
          produs: 'none'
        }),
        columns: columnsFarmacii,
        sort: [{
          property: "date",
          descending: true
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
      }, this.gridfarmacii);
      this.gridfarmacii = gridFarmacii;


      self.producator.subscribe("/tournaments", function(route) {
        //console.log(route);
        self.storetournaments.add(route);
        //console.log('store tournaments subscribe', self.storetournaments);
        //self.producator.set('store', new DstoreAdapter(self.storetournaments));
      });

    } // postCreate
  });
});