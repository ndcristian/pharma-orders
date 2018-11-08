/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function myAlert(message, title, buttonText) {

    buttonText = (buttonText === undefined) ? "Ok" : buttonText;
    title = (title === undefined) ? "The page says:" : title;

    var div = document.createElement('div');
    div.textContent = message;
    div.title = title;
    div.dialog({
        autoOpen: true,
        modal: true,
        draggable: false,
        resizable: false,
        buttons: [{
                text: buttonText,
                click: function () {
                    $(this).dialog("close");
                    div.remove();
                }
            }]
    });
}
