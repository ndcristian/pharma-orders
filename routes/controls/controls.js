module.exports.checkRights = function (userRole, routeRol){
    var rights = routeRol.split("/");
    var check = false;
    for (var right of rights){
        console.log('drepturile sunt:' , right );
        if(right===userRole.rol){
             check = true;
        } 
    }
    return check;
};