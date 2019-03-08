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
      let produsInComanda = {
        cui: self.cfg.user.cui,
        pl: self.cfg.user.pl
      };
      console.log('produs: ', produs);
      let produsInOferta = false; //test if products exist in Necesar and alert user
      let totalCantItem = 0; // keep totals for every products in Necesar
      // define form input events 
      this.produse.set('store', new DstoreAdapter(self.cfg.Produse));
      this.produse.on('change', function(item) {
        produs = {
          cui: self.cfg.user.cui,
          pl: self.cfg.user.pl
        };
        totalCantItem = 0;
        if (item) {
          var itemSelected = this.item;
          console.log("itemSelected", itemSelected);
          self.producator.set('value', this.item.grupproducator);

          self.cfg.Necesar.filter({
            produs: itemSelected.denumirearticol,
            //activ: true
            //pl: self.cfg.user.pl
          }).fetch().then(function(items) {
            console.log("Oferta este", items);
            var necesarDetalii = [];
            if (items.totalLength > 0) {
              //test if products is in necesar an in the same time calculate the total Quantity of the product and 
              //keep in necesarDetalii the quantity for each PL
              items.forEach(function(productsArray) {
                if (productsArray.pl === self.cfg.user.pl) {
                  produsInOferta = true;

                }
                necesarDetalii.push({
                  pl: productsArray.pl,
                  cantitate: productsArray.cantitate
                }); // array with quantity for each PL
                totalCantItem = totalCantItem + (+productsArray.cantitate); // total quantity of the selected products in the necesar
                //console.log("productsArray", productsArray, totalCantItem);
              })
            }

            //console.log("produs in oferta", produsInOferta);

            if (produsInOferta) {

              alert("Produsul este deja in necesarul farmaciei !");
              produsInOferta = true;
            } else {
              var filteristoric = {
                produs: itemSelected.denumirearticol
              };
              console.log('filteristoric', filteristoric);
              self.cfg.Istoric.filter(filteristoric).sort('date').fetch().then(function(items) {
                console.log("items from istoric in necesar", items);
                if (items.totalLength > 0) {
                  let lastItem = items[items.totalLength - 1];
                  console.log("item din istoric last aquizision", lastItem, items);
                  produs.lastFurnizor = lastItem.furnizor;
                  produs.lastAchDiscount = lastItem.lastDiscount;
                  produs.lastAchPretFinal = lastItem.lastFinalPret;
                }
              });

              console.log("Nu este in necesar");
              produs.produs = itemSelected.denumirearticol;
              produs.producator = itemSelected.grupproducator;
              produs.dci = itemSelected.dci;
              produs.itemid = itemSelected.itemid;
              produs.cantitate = 1;
              produs.observatii = "";
              produs.activ = true;
              produs.comanda = 0;
              produs.detalii = necesarDetalii;
              produs.date = new Date();
              produsInOferta = false;
            }
          });
        } else {
          self.producator.set('value', 'Invalid value');
        }
        self.cantitate.focus();
      }); // ****** on change

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
          label: "Necesar",
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
          //autoSave: true,
          className: "left",
         // editOnClick: true, //editOn: "click",
          editorArgs: {
            //selectOnClick: true,
            style: "width: 100%;"
          },
          //editor: Textarea
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
//         {
//           field: "delete",
//           label: "Delete",
//           sortable: false,
//           className: "center",
//           renderCell: function(obj, data, cell) {
//             return put("button.remove[title=Șterge] i.fa.fa-trash-o< ");
//           }
//         },

      ];

      //Define grid
      var filter = {};
      var grid = new dgrid.OnDmdSymmaryResizeHide({
        collection: self.cfg.Necesar.filter({
          activ: true,
          pl: self.cfg.user.pl
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
        pagingLinks: false,
        pagingTextBox: true,
        firstLastArrows: true,
        rowsPerPage: 20,
        pageSizeOptions: [10, 20]
      }, this.gridplace);
      this.grid = grid;

      
      
      
       grid.on('dgrid-datachange', function(event) {
         var row = event.cell.row.data;
            self.cfg.Comanda.filter({produs:row.produs}).fetch().then(function(produsInComanda){
            console.log('inainte de scadere',produsInComanda[0], event);
            let updatedCant = (+event.value) - (+event.oldValue);  
            produsInComanda[0].cantitate = (+produsInComanda[0].cantitate) + updatedCant;
            console.log(produsInComanda);
            self.cfg.Comanda.add(produsInComanda[0]).then(alert('Produs modificat in comanda'))
          })
       })
     
//       grid.on('.field-delete button.remove:click', function(evt) {
//         var row = grid.row(evt).data;
//         console.log('row', row);
//         //row.deleted = 1;
//         grid.collection.remove(row._id).then(function(item) {
//           console.log('Item removed fron necesar', item);
//           self.cfg.Comanda.filter({produs:row.produs}).fetch().then(function(produsInComanda){
//             console.log(produsInComanda);
//             produsInComanda[0].cantitate = +produsInComanda.cantitate- (+row.cantitate);
//             console.log(produsInComanda);
//             self.cfg.Comanda.add(produsInComanda[0]).then(alert('Produs modificat in comanda'))
//           })
//         });
//       });
      
      this.btnSave.on('click', function() {
        console.log(self.filterForm.validate());
        if (Object.keys(produs).length > 0 && self.filterForm.validate() && !produsInOferta) {
          produs.cantitate = self.cantitate.value;
          produs.observatii = self.observatii.value;
          totalCantItem = totalCantItem + (+self.cantitate.value);
          console.log('produs inserted: ', produs, "totalCantItem", totalCantItem);
          console.log('Object Key produs', Object.keys(produs));

          self.grid.collection.add(produs)
            .then(function(item) {
              //self.grid.set('sort', 'email');
              //console.log('self.checkUser', self.checkUser);

              console.log('btnsaveClick item is: ', item);
              produsInOferta = false;
              if (item.error) {
                alert("You are not Logged in. Press F5 to redirect to login page")
              }


              //----- create record for command and insert the product into comanada
              produs.detalii.push({
                pl: self.cfg.user.pl,
                cantitate: totalCantItem
              });
              produsInComanda = produs;
              produsInComanda.cantitate = totalCantItem;
              produsInComanda.lastPrice = "";
              produsInComanda.lastDiscount = "";
              produsInComanda.lastFinalPret = "";
              produsInComanda.idnecesar = item._id;
            produsInComanda.observatii = "obs";


              self.cfg.Comanda.filter({
                produs: produs.produs,
              }).fetch().then(function(items) {

                if (items.length > 0) {
                  items[0].cantitate = totalCantItem;
                  console.log('items before push', items);
                  items[0].detalii.push({pl:self.cfg.user.pl,cantitate:self.cantitate.value })
                  produsInComanda = items[0];
                  console.log('items after push', produsInComanda)
                }
                self.cfg.Comanda.add(produsInComanda).then(function(insertedInComanda) {
                  totalCantItem = 0;
                  console.log("insertedInComanda", insertedInComanda);
                  self.grid.refresh();
                })
              });


            });


        } else {
          if (produsInOferta) {
            alert("Produsul este deja in necesarul farmaciei !");
          } else {
            alert('Formularul este invalid. Va rog verificati datele.');
          }

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