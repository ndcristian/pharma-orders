/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//used for validation inputs
console.log('Incarcat', $('.toClick'));

var pattern = {
    string: /^[a-zA-Z]*$/,
    email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    number: /^[0-9]*$/
};
$('.score').blur(function (item) {
    console.log(item);
    if (!(pattern.number.test(item.target.value) && (item.target.value))) {
        item.target.style.backgroundColor = "#ffcccc";
        item.target.value = 0;
        alert('Please enter a valid score');
    } else {
        item.target.style.backgroundColor = "#ffffff";
        if ((pattern.number.test(item.target.form[0].value) && (item.target.form[0].value)
                && pattern.number.test(item.target.form[1].value) && (item.target.form[1].value))) {
            console.log('intra in IF');
            item.target.form[2].disabled = false;
        }
    }
});


$('.toClick').click(function (item) {
    if (!(pattern.number.test(item.target.form[0].value) && (item.target.form[0].value))) {
        item.target.form[0].style.backgroundColor = "#ffcccc";
        item.target.form[0].value = 0;
        console.log('Spatiu liber');
    } else {
        item.target.form[0].style.backgroundColor = "#ffffff";
    }
    if (!(pattern.number.test(item.target.form[1].value) && (item.target.form[1].value))) {
        item.target.form[1].style.backgroundColor = "#ffcccc";
        item.target.form[1].value = 0;
        console.log('Spatiu liber');
    } else {
        item.target.form[1].style.backgroundColor = "#ffffff";
    }
    console.log('dddddd', item.target.form[0].value);
    //alert('Not correct!');
});


function validation(formValues) {





}
