/**
 *  @author: Isaac Vega Rodriguez          <isaacvega1996@gmail.com>
 */

/**

  @params:
    @a: div element to set up things
    @b: source directory of the json file

 */
function Form(a, b) {

  'use strict';

  if ( !(this instanceof Form) ) {
    return new Form(a, b);
  }

  var _this = this;

  _this._target = null;

  _this._src = null;

  _this._obj = null;

  _this._events = [
    "load",
    "completed"
  ];

  _this._callbacs = {};

  _this._triggeredEvents = [];

  _this._answeredCallbacs = {};

  _this.formObj = {};

  _this._pageRequirements = {};

  _this._lastArgumentOf = {};

  _this._componentList = [
    'input',
    'radio',
    'checkbox',
    'radioMatrix',
    'checkboxMatrix',
    'plainText',
  ];

  _this._defaultErrorMessage = "This field is required. Please, fill it.";

  for (var i = 0; i < _this._events.length; i += 1) {
    _this._callbacs[ _this._events[i] ] = [];
    _this._answeredCallbacs[ _this._events[i] ] = false;
  }

  if ( arguments.length < 2 ) {
    throw new ReferenceError("Constructor must have at least 2 arguments");
  }

  if ( arguments[0] instanceof HTMLDivElement ) {

    if ( typeof arguments[1] === 'string' ) {

      _this.setTarget(arguments[0]);
      _this.setSource(arguments[1]);

    } else {
      throw new TypeError("String expected as second argument");
    }

  } else {
    throw new TypeError("First element must be a <div> element");
  }

}

/// FORM PROPERTIES

Form._components = {
  __from_items : function(container, type, data, form) {

    var doc = document;

    form.formObj[ data.name ] = null;

    var createItem = function createItem(item, id) {

      var needExtraInput = false;

      if ( type === 'radio' ) {
        if ( /^%/.test(item) === true ) {
          if ( /^%%/.test(item) === false ) {
            needExtraInput = true;
          }
          item = item.substr(1, item.length);
        }
      }

      var li         = doc.createElement('li');
      var inp        = doc.createElement('input');
      var descriptor = doc.createElement('span');

      ///---------------------------------------------

      var _extraInp = doc.createElement('input');

      _extraInp.setAttribute('type', 'text');
      //_extraInp.setAttribute('size', '30');
      _extraInp.setAttribute('name', data.name);
      _extraInp.setAttribute('placeholder', '');
      _extraInp.setAttribute('form-type', 'form-extra-input');

      ///---------------------------------------------

      inp.setAttribute("type", type);
      inp.setAttribute("name", data.name || '');
      inp.setAttribute("itemNumber", id.toString());

      var inputClickHandler = function inputClickHandler() {

        if ( type === "radio" ) {
          form.formObj[ data.name ] = item;
        } else if ( type === 'checkbox' ) {
          if ( inp.checked === true ) {
            form.formObj[ data.name ] = form.formObj[ data.name ] || [];
            form.formObj[ data.name ].push( item );
          } else {
            form.formObj[ data.name ].splice( form.formObj[ data.name ].indexOf( item ), 1 );
            if ( form.formObj[ data.name ].length === 0 ) {
              delete form.formObj[ data.name ];
            }
          }
        }

      };

      inp.addEventListener('click', inputClickHandler, false);

      descriptor.className = "form-input-descriptor";

      descriptor.innerHTML = item;

      descriptor.addEventListener('click', function() {

        if ( type === "radio" ) {
          inp.checked = true;
          inputClickHandler();
        } else if ( type === "checkbox" ) {
          inp.checked = !inp.checked;
          inputClickHandler();
        }

      }, false);

      li.appendChild(inp);
      li.appendChild(descriptor);

      if ( needExtraInput === true ) {

        var flg       = doc.createElement('div');
        var flb       = doc.createElement('div');

        flg.className       = "form-line-group";
        flb.className       = "form-line-bottom";

        _extraInp.addEventListener('input', function() {

          inp.checked = true;

          var realValue = _extraInp.value;;

          if ( realValue === '' ) {
            form.formObj[ data.name ] = null;
          } else {
            form.formObj[ data.name ] = realValue;
          }

        }, false);

        flg.appendChild(_extraInp);
        flg.appendChild(flb);

        li.appendChild(flg);

      }

      container.appendChild(li);

    };

    for (var i = 0; i < data.items.length; i += 1) {
      createItem(data.items[i], i);
    }

  },
  __from_matrix : function(container, type, data, form, requirements) {

    if ( data.hasOwnProperty('answerBy') === true ) {

      if ( ["rows", "cols"].indexOf(data.answerBy) === -1 ) {
        data.answerBy = "rows";
      }

    } else {
      data.answerBy = "rows";
    }

    var doc = document;

    (function() {

      var idx = form._pageRequirements[ form._pages - 1 ].indexOf( data.name );

      form._pageRequirements[ form._pages - 1 ][ idx ] = {
        name : data.name,
        requirements : []
      };

      var i;

      if ( data.answerBy === "cols" ) {

        for ( i = 0; i < data.cols.length; i += 1 ) {
          form._pageRequirements[ form._pages - 1 ][ idx ].requirements.push( data.cols[i].name );
        }

      } else {

        for ( i = 0; i < data.rows.length; i += 1 ) {
          form._pageRequirements[ form._pages - 1 ][ idx ].requirements.push( data.rows[i].name );
        }

      }

    })();

    form.formObj[ data.name ] = {};

    var thisObj = form.formObj[ data.name ];

    var inputClickHandler = function inputClickHandler(e) {

      var elem = e.target;

      var rowName = elem.getAttribute('row');
      var colName = elem.getAttribute('col');

      if ( type === "radio" ) {

        if ( data.answerBy === "cols" ) {
          thisObj[ colName ] = rowName;
        } else {
          thisObj[ rowName ] = colName;
        }

      } else if ( type === "checkbox" ) {

        if ( data.answerBy === "cols" ) {
          thisObj[ colName ] = thisObj[ colName ] || [];
          if ( elem.checked === true ) {
            thisObj[ colName ].push( rowName );
          } else {
            thisObj[ colName ].splice( thisObj[ colName ].indexOf( rowName ), 1 );
            if ( thisObj[ colName ].length === 0 ) {
              delete thisObj[ colName ];
            }
          }
        } else {
          thisObj[ rowName ] = thisObj[ rowName ] || [];
          if ( elem.checked === true ) {
            thisObj[ rowName ].push( colName );
          } else {
            thisObj[ rowName ].splice( thisObj[ rowName ].indexOf( colName ), 1 );
            if ( thisObj[ rowName ].length === 0 ) {
              delete thisObj[ rowName ];
            }
          }
        }

      }

    };

    for (var i = 0; i < data.rows.length; i += 1) {

      var tr = doc.createElement('tr');
      var th = doc.createElement('th');

      th.innerHTML = data.rows[i].title || '';

      tr.appendChild(th);

      for (var j = 0; j < data.cols.length; j += 1) {

        var td  = doc.createElement('td');
        var inp = doc.createElement('input');

        inp.setAttribute("type", type);
        inp.setAttribute("row", data.rows[i].name || '');
        inp.setAttribute("col", data.cols[j].name || '');

        if ( data.answerBy === 'rows' ) {
          inp.setAttribute("name", data.rows[i].name || '');
        } else {
          inp.setAttribute("name", data.cols[j].name || '');
        }

        inp.addEventListener('click', inputClickHandler, false);

        td.appendChild(inp);

        tr.appendChild(td);

      }

      container.appendChild(tr);

    }

  },
  __basic_component : function(data, form) {

    form._pageRequirements[ form._pages - 1 ].push( data.name );

    var doc = document;

    var container = doc.createElement('div');
    var h3        = doc.createElement('h3');
    var p         = doc.createElement('p');

    container.className = "form-" + data.type;
    h3.className        = "form-title";
    p.className         = "form-subtitle";

    h3.innerHTML = data.title || '';
    p.innerHTML  = data.subtitle || '';

    container.appendChild(h3);
    container.appendChild(p);

    if ( data.type === 'plainText' ) {
      data.name = '_';
      data.optional = true;
    }

    container.setAttribute('form-name', data.name);

    if ( data.hasOwnProperty('validations') === true ) {
      container.setAttribute('form-validations', JSON.stringify(data.validations) );
    }

    if ( data.hasOwnProperty('optional') === true ) {
      container.setAttribute('form-optional', Boolean( data.optional ) );
    }

    return container;

  },
  input : function inputHandler(data, form) {

    var doc = document;
    var container = this.__basic_component(data, form);
    var flg       = doc.createElement('div');
    var inp       = doc.createElement('input');
    var flb       = doc.createElement('div');

    flg.className       = "form-line-group";
    flb.className       = "form-line-bottom";

    inp.setAttribute("type", "text");
    inp.setAttribute("name", data.name || '');
    inp.setAttribute("size", "30");
    inp.setAttribute("placeholder", data.placeholder || '');

    inp.addEventListener('input', function() {

      var realValue = inp.value.trim();

      if ( realValue === '' ) {
        form.formObj[ data.name ] = null;
      } else {
        form.formObj[ data.name ] = realValue;
      }

    }, false);

    flg.appendChild(inp);
    flg.appendChild(flb);

    var err = doc.createElement('p');

    err.className = 'form-error';

    if ( data.hasOwnProperty('onError') === true ) {
      err.innerHTML = data.onError;
    } else {
      err.innerHTML = form._defaultErrorMessage;
    }

    container.appendChild(flg);
    container.appendChild(err);

    return container;

  },
  radio : function radioHandler(data, form) {

    var doc = document;
    var container = this.__basic_component(data, form);
    var ul        = doc.createElement('ul');

    if ( data.hasOwnProperty('items') ) {
      this.__from_items(container, 'radio', data, form);
    }

    var err = doc.createElement('p');

    err.className = 'form-error';

    if ( data.hasOwnProperty('onError') === true ) {
      err.innerHTML = data.onError;
    } else {
      err.innerHTML = form._defaultErrorMessage;
    }

    container.appendChild(err);

    return container;

  },
  checkbox : function checkboxHandler(data, form) {

    var doc = document;
    var container = this.__basic_component(data, form);
    var ul        = doc.createElement('ul');

    if ( data.hasOwnProperty('items') ) {
      this.__from_items(container, 'checkbox', data, form);
    }

    var err = doc.createElement('p');

    err.className = 'form-error';

    if ( data.hasOwnProperty('onError') === true ) {
      err.innerHTML = data.onError;
    } else {
      err.innerHTML = form._defaultErrorMessage;
    }

    container.appendChild(err);

    return container;

  },
  radioMatrix : function radioMatrixHandler(data, form) {

    var doc = document;

    var container = this.__basic_component(data, form);
    var table     = doc.createElement('table');
    var headers   = doc.createElement('tr');

    headers.appendChild( doc.createElement('th') );

    // console.log('radioMatrixHandler: ', data);

    for (var i = 0; i < data.cols.length; i += 1) {

      var th = doc.createElement('th');

      th.innerHTML = data.cols[i].title || '';

      headers.appendChild(th);

    }

    table.appendChild(headers);

    this.__from_matrix(table, "radio", data, form, data.requirements || []);

    var err = doc.createElement('p');

    err.className = 'form-error';

    if ( data.hasOwnProperty('onError') === true ) {
      err.innerHTML = data.onError;
    } else {
      err.innerHTML = form._defaultErrorMessage;
    }

    container.appendChild(table);
    container.appendChild(err);

    return container;

  },
  checkboxMatrix : function checkboxMatrixHandler(data, form) {

    var doc = document;

    var container = this.__basic_component(data, form);
    var table     = doc.createElement('table');
    var headers   = doc.createElement('tr');

    headers.appendChild( doc.createElement('th') );

    for (var i = 0; i < data.cols.length; i += 1) {

      var th = doc.createElement('th');

      th.innerHTML = data.cols[i].title || '';

      headers.appendChild(th);

    }

    table.appendChild(headers);

    this.__from_matrix(table, "checkbox", data, form, data.requirements || []);

    var err = doc.createElement('p');

    err.className = 'form-error';

    if ( data.hasOwnProperty('onError') === true ) {
      err.innerHTML = data.onError;
    } else {
      err.innerHTML = form._defaultErrorMessage;
    }

    container.appendChild(table);
    container.appendChild(err);

    return container;

  },
  plainText : function plainTextHandler(data, form) {

    var doc = document;
    var container = this.__basic_component(data, form);

    var div = doc.createElement('div');

    div.className = 'form-plain-text-body';

    div.innerHTML = data.content;

    container.appendChild(div);

    return container;

  }
};

Form.VALIDATIONS = {
  number: function validateNumber(n, list) {

    //console.log('VALIDATING NUMBER: ', n, list);

    list = list || [];

    if ( n === null || n === undefined ) {
      return false;
    }

    var a, b, _n, id;

    if ( typeof n === 'string' ) {

      _n = parseFloat(n);

      if ( isNaN(_n) === true ) {
        return false;
      }

      //console.log('OK: Is a number: ', _n);

      while( true ) {

        id = list.indexOf('integer');

        if ( id > -1 ) {

          list.splice(id, 1);

          if ( _n != ~~_n ) {
            //console.log('FAIL: Not an integer: ', _n);
            return false;
          }

          //console.log('OK: Is an integer: ', _n);

        } else {
          break;
        }

      }

      for ( var i = 0; i < list.length; i += 1 ) {

        list[i] = list[i].trim();

        if ( /^>/.test(list[i]) === true ) {
          if ( /^>=/.test(list[i]) === true ) {
            a = parseFloat(list[i].substr(2, list[i].length));

            if ( _n < a ) {
              //console.log('FAIL: %s is not >= %s', _n, a);
              return false;
            }

            //console.log('OK: %s is >= %s', _n, a);

          } else {

            a = parseFloat(list[i].substr(1, list[i].length));

            if ( _n <= a ) {
              //console.log('FAIL: %s is not > %s', _n, a);
              return false;
            }

            //console.log('OK: %s is > %s', _n, a);

          }
        }

        if ( /^</.test(list[i]) === true ) {
          if ( /^<=/.test(list[i]) === true ) {
            a = parseFloat(list[i].substr(2, list[i].length));

            if ( _n > a ) {
              //console.log('FAIL: %s is not <= %s', _n, a);
              return false;
            }

            //console.log('OK: %s is <= %s', _n, a);

          } else {

            a = parseFloat(list[i].substr(1, list[i].length));

            if ( _n >= a ) {
              //console.log('FAIL: %s is not < %s', _n, a);
              return false;
            }

            //console.log('OK: %s is < %s', _n, a);

          }
        }

        if ( /^==/.test(list[i]) === true ) {

          a = parseFloat(list[i].substr(2, list[i].length));

          if ( a != _n ) {
            //console.log('FAIL: %s is not equal to %s', _n, a);
            return false;
          }

          //console.log('OK: %s is equal to', _n, a);

        }

        if ( /^!=/.test(list[i]) === true ) {

          a = parseFloat(list[i].substr(2, list[i].length));

          if ( a === _n ) {
            //console.log('FAIL: %s is not different to %s', _n, a);
            return false;
          }

          //console.log('OK: %s is different to %s', _n, a);

        }

        if ( /:/.test( list[i] ) === true ) {

          if ( /^!/.test( list[i] ) === true ) {

            var parts = list[i].substr(1, list[i].length).split(':');

            if ( parts.length === 2 ) {

              a = parseFloat( parts[0] );
              b = parseFloat( parts[1] );

              if ( a <= _n && _n <= b ) {
                //console.log('FAIL: %s is not outside of [%s; %s]', _n, a, b);
                return false;
              }

              //console.log('OK: %s is outside of [%s; %s]', _n, a, b);

            }

          } else {

            var parts = list[i].split(':');

            if ( parts.length === 2 ) {

              a = parseFloat( parts[0] );
              b = parseFloat( parts[1] );

              if ( a > _n || _n > b ) {
                //console.log('FAIL: %s is not inside of [%s; %s]', _n, a, b);
                return false;
              }

              //console.log('OK: %s is inside of [%s; %s]', _n, a, b);

            }

          }

        }

      }

      //console.log('VALIDATIONS PASSED');

      return true;

    } else {
      return typeof n === 'number';
    }

  },
  text: function validateText(t, list) {

    list = list || [];

    //console.log("Validating text: ", t, list);

    var aux;

    var emailRegexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    var urlRegexp = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \?=.-]*)*\/?$/;

    for (var i = 0; i < list.length; i += 1) {

      list[i] = list[i].trim();

      if ( /^(not)?contains/.test( list[i] ) === true ) {

        aux = list[i].split(':');
        aux.shift();
        aux = aux.join(':');

        if ( aux === '' ) {
          /// ignore!
        } else {

          if ( /^not/.test( list[i] ) === true ) {
            return t.indexOf( aux ) === -1;
          } else {
            return t.indexOf( aux ) > -1;
          }
        }

      }

      if ( list[i] === 'email' ) {

        if ( emailRegexp.test( t ) === false ) {
          return false;
        }

      }

      if ( list[i] === 'url' ) {

        if ( urlRegexp.test( t ) === false ) {
          return false;
        }

      }

    }

    return true;

  },
  regexp: function validateRegexp(t, list) {

    //console.log('REGEXP', t, list);

    var reg;

    for (var i = 0; i < list.length; i += 1) {

      reg = RegExp(list[i]);

      if ( reg.test( t ) === false ) {
        //console.log('FAIL:', t, 'does not match with', reg);
        return false;
      } else {
        //console.log('OK:', t, 'match with', reg);
      }

    }

    return true;

  },
  length: function validateLength(t, list) {

    //console.log('LENGTH: ', t, typeof t, list);

    list = list || {};

    if ( list.hasOwnProperty('min') === true ) {
      list.min = ~~list.min;

      if ( list.min >= 0 ) {
        if ( t.length < list.min ) {
          //console.log('FAIL:', t.length, 'is <', list.min);
          return false;
        }
      }

    }

    if ( list.hasOwnProperty('max') === true ) {
      list.max = ~~list.max;

      if ( list.max >= 0 ) {
        if ( t.length > list.max ) {
          //console.log('FAIL:', t.length, 'is >', list.max);
          return false;
        }
      }

    }

    return true;

  }
};

/// FORM PROTOTYPES

Form.prototype.validate = function validate(validation, val) {

  //console.log(validation);

  if ( Form.VALIDATIONS.hasOwnProperty(validation.type) === true ) {
    //console.log('VALIDATING...');
    return Form.VALIDATIONS[ validation.type ].call(this, val, validation.list || []);
  } else {
    return true;
  }

};

Form.prototype.addValidation = function addValidation(type, func) {

  if ( typeof type === 'string' ) {

    type = type.trim();

    if ( type !== '' && typeof func === 'function') {

      Form.VALIDATIONS[ type ] = func;

      return true;

    }

  }

  return false;

};

Form.prototype.on = function on(ev, callback) {

  var _this = this;

  if ( typeof ev === 'string' && typeof callback === 'function' ) {

    if ( _this._events.indexOf(ev) > -1 ) {

      _this._callbacs[ ev ].push( callback );

      if ( _this._triggeredEvents.indexOf( ev ) > -1 ) {
        callback.apply( _this, _this._lastArgumentOf[ ev ] );
      }

    }

  }

};

Form.prototype.triggerEvent = function triggerEvent(ev) {

  var _this = this;
  var params = Array.from(arguments).slice(1, arguments.length);

  var i;

  if ( _this._events.indexOf(ev) > -1 ) {

    if ( _this._triggeredEvents.indexOf(ev) === -1 ) {

      _this._triggeredEvents.push( ev );
      _this._lastArgumentOf[ ev ] = params;

      for ( i = 0; i < _this._callbacs[ ev ].length; i += 1) {
        _this._callbacs[ ev ][ i ].apply(_this, params);
      }

    } else {

      if ( params.length === 0 ) {
        params = _this._lastArgumentOf[ ev ];
      }

      if ( params != _this._lastArgumentOf[ ev ] ) {
        _this._lastArgumentOf[ ev ] = params;
      }

      for ( i = 0; i < _this._callbacs[ ev ].length; i += 1) {
        _this._callbacs[ ev ][ i ].apply(_this, params);
      }

    }

  }

};

Form.prototype.setTarget = function setTarget(t) {

  if ( t instanceof HTMLDivElement ) {
    this._target = t;
  } else {
    throw new TypeError("First element must be a <div> element");
  }

};

Form.prototype.setSource = function setSource(src) {

  var _this = this;

  var _sender = new XMLHttpRequest();

  _sender.open("GET", src, true);

  _sender.addEventListener('load', function(e) {

    if ( e.target.readyState === 4 ) {
      if ( e.target.status < 400 ) {

        var data = JSON.parse( e.target.responseText);

        //console.log( data );

        _this._obj = data;

        _this.triggerEvent('load', data);

        _this.compile();

        return;

      }
    }

    throw new Error("Error while loading the data");

  }, false);

  _sender.send(null);


};

Form.prototype.createComponent = function createComponent(comp, data) {

  var div = document.createElement('div');

  div.className = 'form-' + comp;

  if ( Form._components.hasOwnProperty(comp) === true ) {
    return Form._components[ comp ](data, this);
  }

  return div;

};

Form.prototype.nextPage = function nextPage() {

  this.goToPage(this._currentPage + 1);

};

Form.prototype.prevPage = function prevPage() {

  this.goToPage(this._currentPage - 1);

};

Form.prototype.goToPage = function goToPage(id) {

  id = ~~id;

  if ( id < 0 ) {
    throw new TypeError("Expected a non-negative number as page index.");
  }

  if ( this._target != null ) {

    var pages     = this._target.querySelectorAll('.form-page');
    var nextBtn   = this._target.querySelector('.form-next-page');
    var prevBtn   = this._target.querySelector('.form-prev-page');
    var submitBtn = this._target.querySelector('.form-submit');

    if ( !!pages ) {
      if ( pages.length > id ) {

        this._currentPage = id;

        if ( this._currentPage + 1 < pages.length ) {
          nextBtn.classList.remove('form-hidden');
          submitBtn.classList.add('form-hidden');
        } else {
          nextBtn.classList.add('form-hidden');
          submitBtn.classList.remove('form-hidden');
        }

        if ( this._currentPage - 1 >= 0 ) {
          prevBtn.classList.remove('form-hidden');
        } else {
          prevBtn.classList.add('form-hidden');
        }

        for( var i = 0; i < pages.length; i += 1 ) {
          if ( i != id ) {
            pages[i].classList.add('form-hidden');
          } else {
            pages[i].classList.remove('form-hidden');
          }
        }

      } else {
        throw new ReferenceError("Page #" + id + " not found");
      }
    } else {
      throw new ReferenceError("No page found");
    }

  } else {
    throw new ReferenceError("Target element not found");
  }

};

Form.prototype.pageComplete = function pageComplete() {

  var _this = this;

  var cp  = _this._currentPage;
  var doc = document;

  var rec = function(arr, obj, lv) {

    var ret = true, ret1;
    var name;

    for (var i = 0; i < arr.length; i += 1) {

      ret1 = true;

      if ( typeof arr[i] === 'string' ) {

        name = arr[i];

        if ( obj.hasOwnProperty(arr[i]) === false ) {
          ret1 = false;
        } else if ( Boolean(obj[ arr[i] ]) === false ) {
          ret1 = false;
        }

      } else {

        name = arr[i].name;

        ret1 = rec( arr[i].requirements, obj[ arr[i].name ], lv + 1 );

      }

      if ( lv === 0 && typeof arr[i] === 'string' ) {

        var elem = doc.querySelector('[form-name="' + name + '"]');

        var val = elem.getAttribute('form-validations');
        var isOptional = !!elem.getAttribute('form-optional');

        if ( val != null ) {

          val = JSON.parse(val);

          //console.log(val);

          if ( ret1 === false ) {

            ret1 = isOptional;

          } else {

            for (var j = 0; j < val.length && ret1 === true; j += 1) {
              if ( _this.validate( val[j], obj[ arr[i] ] ) === false ) {
                ret1 = false;
              }
            }

          }

        } else if ( name === '_' || isOptional === true ) {
          ret1 = true;
        }

      }

      // console.log('NAME, RET1, LV: ', name, ret1, lv);

      if ( ret1 === false && lv === 0 ) {

        doc
          .querySelector('[form-name="' + name + '"]')
          .classList
          .add('form-incomplete');

      } else if ( ret1 === true && lv === 0 ) {

        doc
          .querySelector('[form-name="' + name + '"]')
          .classList
          .remove('form-incomplete');

      }

      ret = ret && ret1;

    }

    return ret;

  };

  return rec( _this._pageRequirements[ cp ], _this.formObj, 0 );

};

Form.prototype.compile = function compile() {

  if ( this._target != null ) {

    var _this = this;

    var tg = _this._target;

    var pageCounter = 0;

    var doc = document;

    tg.innerHTML = '';

    var ul = doc.createElement('ul');

    ul.className = 'form-pagelist';

    var rec = function rec(elem, obj) {

      var keys = Object.keys(obj);

      var context = elem;

      for(var i = 0; i < keys.length; i += 1) {

        if ( keys[i] === 'type' ) {
          if ( obj.type === 'page' ) {

            _this._pageRequirements[ pageCounter ] = [];

            pageCounter += 1;

            _this._pages = pageCounter;

            var li = doc.createElement('li');
            var h2 = doc.createElement('h2');
            var p = doc.createElement('p');

            li.className = 'form-page';
            h2.className = 'form-page-header form-title';
            p.className = 'form-page-subtitle form-subtitle';

            h2.innerHTML = obj.title;
            p.innerHTML = obj.subtitle;

            li.appendChild(h2);
            li.appendChild(p);

            context.appendChild(li);

            context = li;

          } else if ( _this._componentList.indexOf(obj.type) > -1 ) {

            context.appendChild( _this.createComponent(obj.type, obj) );

          }
        } else if ( keys[i] === "items" ) {

          for (var j = 0; j < obj.items.length; j += 1) {

            rec(context, obj.items[j]);

          }

        }

      }

    };

    rec(ul, _this._obj);

    tg.appendChild(ul);

    var btnContainer = doc.createElement('div');
    var btnPrev      = doc.createElement('button');
    var btnNext      = doc.createElement('button');
    var btnSubmit    = doc.createElement('button');

    btnPrev.innerHTML   = "Previous";
    btnNext.innerHTML   = "Next";
    btnSubmit.innerHTML = "Submit";

    btnContainer.className = 'form-btn-container';
    btnNext.className      = 'form-next-page';
    btnPrev.className      = 'form-prev-page';
    btnSubmit.className    = 'form-submit';

    btnPrev.addEventListener('click', function() {

      _this.prevPage();

    }, false);

    btnNext.addEventListener('click', function() {

      if ( _this.pageComplete() === true ) {
        _this.nextPage();
      }

    }, false);

    btnSubmit.addEventListener('click', function() {

      if ( _this.pageComplete() === true ) {

        _this.triggerEvent('completed', _this.formObj);

      }

    }, false);

    btnContainer.appendChild(btnPrev);
    btnContainer.appendChild(btnNext);
    btnContainer.appendChild(btnSubmit);
    btnContainer.appendChild(btnSubmit);

    ul.appendChild(btnContainer);

    _this.goToPage(0);

  } else {
    throw new ReferenceError("Target element not found");
  }

};//*/