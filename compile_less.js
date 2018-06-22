/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

'use strict';

var fs   = require('fs');
var less = require('less');

var code = fs.readFileSync('less/forms.less');

less.render( code.toString() )
  .then(function(output) {

    fs.writeFileSync('css/forms.css', output.css);

  })
  .catch(function(err) {
    console.log('ERROR:', err);
  });