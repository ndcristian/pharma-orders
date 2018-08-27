/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.exports.model = {
    node_version: "8.6.0",
    mongodb_version: "3.4.10",
    infoLivrare:"not",
    database: "bet",
    routes: {
        matches_get: {
            route: "",
            type: "get",
            model_function:"get_get",
            collection: {
                main:"match",
                get:"bets",
                post:""
            },
            template: "index",
            sum: "fieldToSum",
            rol: "admin/creator/player",
            query: {
                query: {datastartbet: {$lte: "" + new Date().toISOString() + ""}, datastopbet:{$gte:"" + new Date().toISOString() + ""}},
                sort: {datastart: 1}
            }
        },// i have to define query in routemodels for function get_post
        bets_post: {
            route: "bet",
            type: "post",
            model_function:"get_post",
            collection: {
                main:"match",
                get:"match",
                post:"bets"
            },
            id:"_id",
            restrictedId: "playerId",
            template: "index",
            sum: "fieldToSum",
            rol: "admin/creator/player"
        },
        tournaments_get:{
            route: "tournaments",
            type: "get",
            model_function:"get",
            collection: {
                main:"players",
                get:"",
                post:""
            },
            id:"_id",
            restrictedId: "playerId",
            template: "tournaments",
            sum: "fieldToSum",
            rol: "admin/creator/player",
            query: {
                query: {deleted:0},
                sort: {datastop: -1}
            }
        },
        teams_get:{
            route: "teams",
            type: "get",
            model_function:"get",
            collection: {
                main:"teams",
                get:"",
                post:""
            },
            id:"_id",
            restrictedId: "",
            template: "teams",
            sum: "fieldToSum",
            rol: "admin/creator/player",
            query: {sort: {name: 1}}
        }
    }
};
