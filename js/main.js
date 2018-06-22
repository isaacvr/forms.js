window.addEventListener('load', main, false);

function main() {

  var form = document.querySelector("#myForm");

  var fm = Form(form, 'yaml/form1.yaml');

  fm.addValidation('myEmail', function(elem) {

    console.log( Object.keys(this) );

    return elem === 'isaacvega1996@gmail.com';

  });

  fm.on('load', function(data) {

    console.log('DATA: ', data);

  });

  fm.on('completed', function(form) {

    console.log('FORM: ', form);

  });

  //console.log(fm);

}