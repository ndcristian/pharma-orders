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
      });

      this.produse.on('change', function(item) {
        console.log('item in produse on change', item,self.produse.get('displayedValue'));
        if (item) {
          console.log('item in produse on change', item);
          self.grid.set('collection', self.cfg.Comanda.filter({produs:self.produse.get('displayedValue')}))

        }}); 
         this.producator.on('change', function(item,x) {
           console.log('item in produse on change', item,self.producator.get('displayedValue'));
        if (item) {
          self.grid.set('collection', self.cfg.Comanda.filter({producator:self.producator.get('displayedValue')}))

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
          field: "lastFurnizor",
          label: "Furnizor",
          className: "left",
          editOnClick: false, //editOn: "click",
          editorArgs: {
            style: "width: 100%;"
          }
        },
         {
          field: "lastAchDiscount",
          label: "%Ach",
          className: "left",
          editorArgs: {
            style: "width: 100%;"
          }
        },
        {
          field: "lastAchPretFinal",
          label: "PretAch",
          className: "left",
          formatter: dgrid.cell.formatter.n2,
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
          formatter: dgrid.cell.formatter.n2,
          editorArgs: {
            selectOnClick: true,
            pattern: '[0-9]+(\.[0-9]{1,2})?',
            style: "width: 100%;"
          },
          editor: ValidationTextBox
        },
        {
          field: "lastDiscount",
          label: "%",
          className: "right",
          autoSave: true,
          editOnClick: true, //editOn: "click",
          editorArgs: {
            selectOnClick: true,
            pattern: '[0-9]+(\.[0-9]{1,2})?',
            style: "width: 100%;"
          },
          editor: ValidationTextBox
        },

        {
          field: "lastFinalPret",
          label: "PretRedus",
          className: "right",
          formatter: dgrid.cell.formatter.n2,
          autoSave: true,

        },
        {
          field: "cantitate",
          label: "Necesar",
          className: "right",
          autoSave: true,
          editOnClick: false, //editOn: "click",
          editorArgs: {
            pattern: '[0-9]+(\.[0-9]{1,2})?',
            style: "width: 100%;"
          },

        },
        {
          field: "comanda",
          label: "Comanda",
          className: "right",
          autoSave: true,
          editOnClick: false, //editOn: "click",
          editorArgs: {
            selectOnClick: true,
            pattern: '[0-9]+(\.[0-9]{1,2})?',
            style: "width: 100%;"
          },
          editor: ValidationTextBox
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
          field: "comandat",
          label: "Comandat",
          sortable: false,
          className: "center",
          renderCell: function(obj, data, cell) {
            return put("button.comandat[title=Comanda] i.fa.fa-check-square< ");
          }
        }
      ];

      //Define grid

      var grid = new dgrid.OnDmdSymmaryResizeHide({
        collection: self.cfg.Comanda.filter({
          //activ: true,
          cui: self.cfg.user.cui
        }),
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


      grid.on('dgrid-datachange', function(event) {
        console.log("event", event);
        var row = event.cell.row.data;
        console.log("row before", row);

        //event.cell.row.data.lastFinalPret = (+event.cell.row.data.lastPrice) * (1- (+event.cell.row.data.lastDiscount/100));
        if (event.cell.column.field === "lastDiscount" || event.cell.column.field === "lastPrice") {
          console.log("field selected");
          
          row.lastDiscount = event.cell.column.field === "lastDiscount" ? event.value : row.lastDiscount;
          row.lastPrice = event.cell.column.field === "lastPrice" ? event.value : row.lastPrice;
          row.lastFinalPret = (+row.lastPrice) * (1 - (+row.lastDiscount) / 100);
          var recordConditii = {};
         Object.assign(recordConditii, row);
          recordConditii.detalii='';
          recordConditii.furnizor = self.distribuitor.get('displayedValue');
          recordConditii.id = row._id + self.distribuitor.get('displayedValue');
          recordConditii.idcomanda = row._id;
          console.log ('row dupa conditii', recordConditii);
         
          self.cfg.Conditii.add(recordConditii).then(function(cond){
            console.log('conditii', cond); 
          })
        }

      })
      
      grid.on('dgrid-deselect', function(x){
        console.log('xxx',x);
      })

      grid.on('dgrid-select', function(selectedProd) {
        console.log('selected prod este :', selectedProd.rows[0].data);
        produsSelected = selectedProd.rows[0].data.produs;
        console.log(produsSelected);
        console.log('grid este', self.gridfarmacii.collection);
        self.gridfarmacii.set('collection', self.cfg.Necesar.filter({
          produs: produsSelected
        }));
        self.gridconditii.set('collection', self.cfg.Conditii.filter({
          idcomanda: selectedProd.rows[0].data._id
        }));
       
      })

      grid.on('.field-comandat button.comandat:click', function(evt) {
        var row = grid.row(evt).data;
        
        grid.collection.remove(row._id).then(function(item) {
          console.log('am fost sters', item);
          delete row._id;
          console.log("clickUpdate", row);
          row.furnizor = self.distribuitor.get('displayedValue');
          //add record to istoric tabele
          self.cfg.Istoric.add(row).then(function(item) {
            console.log("item comandat", item);
            //remove record from necesar
            self.cfg.NecesarRemove.remove(row.idnecesar);
          });
          
        });


      });
      grid.on('.field-delete button.remove:click', function(evt) {
        var row = grid.row(evt).data;
        console.log('row', row);
        grid.collection.remove(row._id).then(function(item) {
         self.cfg.NecesarRemove.remove(row.idnecesar);
        });
      });
      
       this.btnRefresh.on('click', function() {
         self.grid.set('collection', self.cfg.Comanda.filter({}).sort('date'));
       })

      //***********-Define grid in Detalii necesar pe farmacii

      var columnsFarmacii = [{
          field: "pl",
          label: "Farmacia",
          //autoSave: true,
          className: "left",
         // editOnClick: true, //editOn: "click",
          editorArgs: {
            //selectOnClick: true,
            style: "width: 100%;"
          },
        },
          {
          field: "produs",
          label: "Produs",
          //autoSave: true,
          className: "left",
          //editOnClick: true, //editOn: "click",
          editorArgs: {
            //selectOnClick: true,
            style: "width: 100%;"
          }
        }, 
        {
          field: "cantitate",
          label: "Necesar",
          //autoSave: true,
          className: "right",
          //editOnClick: true, //editOn: "click",
          editorArgs: {
            //selectOnClick: true,
            style: "width: 100%;"
          }
        }, {
          field: "observatii",
          label: "Observatii",
          //autoSave: true,
          className: "left",
          //editOnClick: true, //editOn: "click",
          editorArgs: {
            //selectOnClick: true,
            style: "width: 100%;"
          },
        }
      ];
      var gridFarmacii = new dgrid.OnDmdSymmaryResizeHide({
        collection: self.cfg.Necesar.filter({produs:'none'}),
        columns: columnsFarmacii,
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
      }, this.gridfarmacii);
      this.gridfarmacii = gridFarmacii;
      
      
//****** Define grid in Conditii comerciale

       var columnsConditii = [{
          field: "furnizor",
          label: "Furnizor",
          className: "left",
           editorArgs: {
             style: "width: 100%;"
          },
        },
          {
          field: "lastPrice",
          label: "Pret",
          className: "left",
          editorArgs: {
            style: "width: 100%;"
          }
        }, 
        {
          field: "lastDiscount",
          label: "Discount",
          className: "left",
          editorArgs: {
            style: "width: 100%;"
          }
        }, {
          field: "lastFinalPret",
          label: "PretFinal",
          className: "left",
          editorArgs: {
            style: "width: 100%;"
          },
        }
      ];
      
      var gridConditii = new dgrid.OnDmdSymmaryResizeHide({
        collection: self.cfg.Conditii.filter({produs:'none'}),
        columns: columnsConditii,
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
      }, this.gridconditii);
      this.gridconditii = gridConditii;
      
      
      
      
//       self.producator.subscribe("/tournaments", function(route) {
//         self.storetournaments.add(route);
        //self.producator.set('store', new DstoreAdapter(self.storetournaments));
//       });

    } // postCreate
  });
});