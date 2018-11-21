/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.exports.model = {
  routes: {
    produse_get: {
      route: "produse",       // route name
      type: "get",                // route type GET-POST-DELETE etc
      model_function: "get",      // function from crud-models
      collection: {               // about collection 
        main: "produse",      // first collection from where get data
        get: "",                  //  used for model_function get-get and is the collection used for the second get
        post: ""                  // idem like preview but with get-post
      },
      template: "",               // used if we have to render  template
      sum: "fieldToSum",          // a filed to sum
      rol: "root",                // who can access this route
      query: {                    // query that can be used in crud_models

      }
    },
     producatori_get: {
      route: "producatori",       // route name
      type: "get",                // route type GET-POST-DELETE etc
      model_function: "get",      // function from crud-models
      collection: {               // about collection 
        main: "producatori",      // first collection from where get data
        get: "",                  //  used for model_function get-get and is the collection used for the second get
        post: ""                  // idem like preview but with get-post
      },
      template: "",               // used if we have to render  template
      sum: "fieldToSum",          // a filed to sum
      rol: "root",                // who can access this route
      query: {                    // query that can be used in crud_models

      }
    },
    necesar_get: {
      route: "necesar",           // route name
      type: "get",                // route type GET-POST-DELETE etc
      model_function: "get",      // function from crud-models
      collection: {               // about collection 
        main: "necesar",          // first collection from where get data
        get: "",                  //  used for model_function get-get and is the collection used for the second get
        post: ""                  // idem like preview but with get-post
      },
      template: "",               // used if we have to render  template
      sum: "fieldToSum",          // a filed to sum
      rol: "root",                // who can access this route
      query: {                    // query that can be used in crud_models

      },
      restictedFiled:""           // this field is used to filter the information from database depending by the user
    },
    necesar_post: {
      route: "necesar",       // route name
      type: "post",                // route type GET-POST-DELETE etc
      model_function: "post",      // function from crud-models
      collection: {               // about collection 
        main: "necesar",      // first collection from where get data
        get: "",                  //  used for model_function get-get and is the collection used for the second get
        post: ""                  // idem like preview but with get-post
      },
      template: "",               // used if we have to render  template
      sum: "fieldToSum",          // a filed to sum
      rol: "root",                // who can access this route
      query: {                    // query that can be used in crud_models

      }
    }
  }
};