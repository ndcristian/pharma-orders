define([
    "dojo/_base/declare",
    "dojo/promise/all",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/layout/BorderContainer",
    "dojo/text!./templates/Layout.html",
    "app/widgets/Oferta",
    "dstore/RequestMemory",
    "dstore/legacy/DstoreAdapter",
    "util/dstore",
    "util/dgrid",
    "util/dateFormat",
    "util/dateParse",
    "dojo/i18n!./nls/Layout",
    "dijit/form/FilteringSelect",
    "dijit/form/ValidationTextBox",
    "dijit/form/Form",
    "dijit/form/Button",
    "put-selector/put",
    "dojo/on",
    "dojo/dom",
    "dojo/parser",
    "dojo/dom-construct",
    "dojo/html",
    "dojo/ready",
    "dojo/domReady!",
    "dijit/layout/TabContainer",
    "dijit/layout/ContentPane"
], function (declare, whenAll, _TemplatedMixin, _WidgetsInTemplateMixin, BorderContainer,
        template, Oferta, RequestMemory, DstoreAdapter, dstore, dgrid, dateFormat, dateParse, nls,
        FilteringSelect, ValidationTextBox, Form, Button, put, on, dom, parser, domConstruct, html, ready
        ) {
    return declare([
        BorderContainer, _TemplatedMixin, _WidgetsInTemplateMixin
    ], {

        templateString: template,
        nls: nls,
        year: null,
        cfg: null,
        postCreate: function () {
            this.inherited(arguments);
            var self = this;

            // define grid store
            self.store = new RequestMemory({
                idProperty: 'itemid',
                target: self.cfg.apiUrl + "/nomenclator/",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });
            self.storeFurnizor = new RequestMemory({
                idProperty: 'itemId',
                target: self.cfg.apiUrl + "/nomenclator/furnizor",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });
            self.storeDci = new RequestMemory({
                idProperty: 'itemId',
                target: self.cfg.apiUrl + "/nomenclator/dci",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });
            self.storePret = new dstore.RestTrackableCache({
                idProperty: 'itemid',
                target: self.cfg.apiUrl + "/nomenclator/",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });
            self.storeOferta = new dstore.RestTrackableCache({
                idProperty: 'itemid',
                target: self.cfg.apiUrl + "/oferta/",
                headers: self.cfg.options.headers,
                useRangeHeaders: true
            });

            this.produs.set('store', new DstoreAdapter(self.store));
            this.producator.set('store', new DstoreAdapter(self.storeFurnizor));
            this.dci.set('store', new DstoreAdapter(self.storeDci));

            this.produs.on('Focus', function () {
                var doom = self.produs.domNode.innerHTML;
                //console.log("filtru produs",document.getElementsByClassName('dijitMenuItem'));
                //console.log("screen", window.innerWidth);

            });

            //console.log("filtru produs",this.produs);
            // define columns
            var columns = [
                {field: "os", label: "OS", sortable: false, className: "center",
                    renderCell: function (obj, data, cell) {
                        //console.log("Render",obj);
                        if (obj.oferta_xo !== 'No') {

                            return put("span.remove[title=OS] i.fa.fa-percent<");
                        }

                    }
                },
                {field: "numeprodus", label: "Nume Produs", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        selectOnClick: false,
                        //pattern: '[A-Za-z]+',
                        style: "width: 100%;"
                    }


                },
                {field: "furnizor", label: "Furnizor", className: "left", editOnClick: false, //editOn: "click",
                    editorArgs: {
                        selectOnClick: false,
                        //pattern: '[A-Za-z]+',
                        style: "width: 100%;"
                    }
                },

                {field: "pretvanzaref", label: "Pret Vanzare", className: "right",
                    editorArgs: {
                        selectOnClick: true,
                        pattern: '[0-9]+(\.[0-9]{1,2})?'
                    }

                },
//                {field: "pretamanuntmax", label: "Pret Amanunt", className: "right",
//                    editorArgs: {
//                        selectOnClick: true,
//                        pattern: '[0-9]+(\.[0-9]{1,2})?'
//                    }
//
//                },
                {field: "bbd", label: "Expir", className: "right",
                    editorArgs: {
                        selectOnClick: true,
                        pattern: '[0-9]+(\.[0-9]{1,2})?'
                    }

                },
                {field: "cantitate", label: "Cantitate", autoSave: true,
                    editorArgs: {
                        selectOnClick: true,
                        pattern: '[0-9]+(\.[0-9]{1,2})?',
                        style: "width: 100%; height:70%;"
                    },
                    editor: ValidationTextBox
                },
                {field: "actions", label: "Act", sortable: false, className: "center",
                    renderCell: function (obj, data, cell) {
                        return put("button.remove[title=Adauga] i.fa.fa-plus-square<");
                    }
                }
            ];

            //Define grid

            var grid = new dgrid.PaginationResizeHide({
                collection: self.store,
                columns: columns,
                sort: [{property: "numeprodus", descending: false}],
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
            }, this.grid);
            this.grid = grid;
            //.dgrid-row:dblclick
            //dgrid-select
            grid.on('dgrid-select', function (event) {

                var element = event.rows[0].element;
                itemSelect = event.rows[0].data.itemid;

                self.storePret.get(itemSelect).then(function (item) {

                    element.getElementsByClassName("field-pretvanzaref")[0].innerHTML = item[0].pretvanzare;

                    self.grid.updateDirty(itemSelect, "pretvanzaref", item[0].pretvanzare);
                });

                self.storeOferta.get(itemSelect).then(function (oferta) {
                    "dojo/html",
                            console.log("oferta", oferta);
                    if (oferta[0]) {
                        //self.detaliiOferta.srcNodeRef.innerHTML = oferta[0].detalii;
                        renderOferta(oferta, afisareOferta);
                    } else {
                        self.detaliiOferta.srcNodeRef.innerHTML = "Nu exista oferta pe produs";
                    }

                });

            });

            this.filterForm.watch('value', function (data, old, value) {
                console.log("filterForm DATA ::", data, old, value);
                self.grid.set('collection', self.store.filter(_renderForm(value)));
            });

            function _renderForm(value) {
                var filter = {};
                if (value.produs) {
                    filter.itemid = value.produs;

//                    self.producator.set('item', {itemId: self.produs.item.furnizor});
//                    self.dci.set('item', {itemId: self.produs.item.dci});
                }

                if (value.producator) {
                    filter.furnizor = value.producator;
                }

                if (value.dci) {
                    filter.dci = value.dci;
                }
                return filter;
            }

            function renderOferta(oferta, callBack) {
                var oferteProdus = [];

                for (k = 0; k < oferta.length; k++) {
                    var ofertaIndiv = {
                        tipOferta: "",
                        tipDiscount: "",
                        tipPrag: "",
                        denumireOferta: "",
                        valabilitate: "",
                        id: "",
                        code: "",
                        praguri: [],
                        initiator: ""
                    };

                    ofertaIndiv.tipoferta = oferta[k].dictionaryitemname;
                    ofertaIndiv.denumireOferta = oferta[k].spoffername;
                    ofertaIndiv.id = oferta[k].specialofferid;
                    ofertaIndiv.code = oferta[k].spoffercode;
                    ofertaIndiv.initiator = oferta[k].tipoferta;
                    //var discounturi = oferta[k].detalii.match(/(\d+%)/g);
                    //var praguri = oferta[k].detalii.match(/la\s+\d+\s+/g);

                    var discounturi = oferta[k].final.split(/\n/g);
                    console.log("discounturi", discounturi);
                    for (indexPrag = 0; indexPrag < discounturi.length; indexPrag++) {

//                        if (ofertaIndiv.tipOferta === "OFERTA PE GRUPE DE PRODUSE" ||ofertaIndiv.tipOferta === "OFERTA PRODUSE CU GRATUITATI") {
//                            var prag = {
//                                prag: discounturi[indexPrag],
//                                discount: ""
//                            };
//                            ofertaIndiv.tipDiscount = "";
//                            ofertaIndiv.tipPrag = "";
//                        } 


                        var prag = {
                            prag: discounturi[indexPrag],
                            discount: ""
                        };
                        ofertaIndiv.tipDiscount = "";
                        ofertaIndiv.tipPrag = "";


//                        var prag = {
//                                prag: praguri[indexPrag].match(/(\d+)/g),
//                                discount: discounturi[indexPrag].match(/(\d+)/g)
//                        };
                        ofertaIndiv.praguri.push(prag);
                    }

                    oferteProdus.push(ofertaIndiv);
                }
                console.log("oferteProdus", oferteProdus);
                callBack(oferteProdus);
            }

            function afisareOferta(item) {
                console.log('item afisare oferta', item);
                self.detaliiOferta.srcNodeRef.innerHTML = "";

                for (j = 0; j < item.length; j++) {
                    var color = item[j].initiator === "EPH" ? "#00cc66" : "#0099ff";

                    var toDisplay = "<div  class='margini', data-dojo-attach-point='titluOferta'" +
                            "><p style = 'margin: 2px; " + " background:" + color + ";" + " '>" + item[j].denumireOferta + "</p>";
                    for (n = 0; n < item[j].praguri.length; n++) {

                        toDisplay = toDisplay + "<p style = 'margin: 2px;'>" + item[j].praguri[n].prag +
                                " " + item[j].tipPrag + "-" + item[j].praguri[n].discount + item[j].tipDiscount + "</p>";

                    }

                    //toDisplay += "<div data-dojo-type='dijit/form/Button' id= 'btnDO' class='button' data-dojo-attach-point='btnDetalii' data-dojo-attach-event='click:clicked()' data-dojo-props=label:'Reset'></div></div>";
                    var cutiiCombinate = [
                        'OFERTA VALORICA PERIODICA', 'OFERTA VALORICA', 'OFERTA CANTITATIVA', 'OFERTA VALORICA PE GRUPE DE PRODUSE'
                    ];
                    var idButton;
                    if (cutiiCombinate.includes(item[j].tipoferta)) {
                        console.log("cutii combinate", item[j].tipoferta);
                        idButton = item[j].id;
                        denumireOferta = item[j].denumireOferta;
                        displayOferta = toDisplay;
                        toDisplay += "<button type='button' id='" + idButton + "' data-dojo-attach-point='btnOferta'  style = 'margin:3px;'>Vezi produse</button></div>";
                        
                    }

                    self.detaliiOferta.srcNodeRef.innerHTML += toDisplay;
                    //html.set(self.detaliiOferta.srcNodeRef, toDisplay, {parseContent: true});
                    //domConstruct.place(toDisplay, self.detaliiOferta.srcNodeRef);
                    if (idButton) {
                        console.log('tttttttt', idButton);
                        on(dom.byId(idButton), 'click', function (evt) {
                            if (j === item.length) {
                                console.log('j-length in on', j, item.length);
                                doOffer(idButton, denumireOferta,displayOferta);
                            }
                        });
                    }
                }

            }
            console.log('self.parent',self);
            function doOffer(idButton, denumireOferta,displayOferta) {
                     var tab = new Oferta({
                        title: denumireOferta,
                        closable: true,
                        cfg: self.cfg,
                        idOferta: idButton,
                        oferta: displayOferta
                    });
                    self.tabContainer.addChild(tab);
                self.tabContainer.selectChild(tab);
            }
            
            //console.log("Self.cfg.store", self.cfg.store);
            this.footerPane.on('click', function (evt) {

            });
        }
    });
});
// to display in grid that the product have or not special offer, i can try to render the server respons
//for the first 30 product and for the rest i can do this in Layout.js and change grid store after finish