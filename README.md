# FORMS.JS

This is a lightweight standalone library to generate forms inside your website. Is based on Google Forms.

## How to include

You only need to download files from github repository, the ones inside the `dist/` directory, and include it in your webpage.

## Setting up things

You can create an instance of a single form like this:

```javascript

  var divElement = document.querySelector('#myDiv');

  var path = "forms/myform.json";

  var form = new Form( divElement, path );

  form.on('load', function(data) {

    console.log('Content loaded from file: ', data);

  });

  form.on('completed', function(data) {

    console.log('The user completed the form, and the data is: ', data);

  });


```

This code is almost all that you need to run your form.

## Events

* `load`: Is triggered when the content is loaded from the file provided, or in general, from the URL provided. The value passed through the callback is the data as a JSON.
* `completed`: This event is triggered when the user submit the form and you can be shure that is already validated, if any validation was provided.

## Validations

You can set up validations that are already defined or you can define them by yourself.

## Pre-defined validations

There are a couple of validations separated by groups:
  * `number`: The input MUST be a number.
    - `>x`: The number provided must be greater than `x`.
    - `>=x`: The number provided must be greater or equal to `x`.
    - `<x`: The number provided must be less than `x`.
    - `<=x`: The number provided must be less or equal to `x`.
    - `==x`: The number provided must be equal `x`.
    - `!=x`: The number provided must be not equal `x`.
    - `x:y`: The number provided must be inside the `[x: y]` interval (inclusive).
    - `!x:y`: The number provided must be outside the `[x: y]` interval (inclusive).
    - `integer`: The number provided must be an `integer`.
  * `text`: The input must be a non-empty text.
    - `contains:str`: The text provided must contain `str`.
    - `notcontains`: The text provided must not contain `str`.
    - `email`: The text provided must be a valid email.
    - `url`: The text provided must be a valid URL.
  * `length`: Text with length restrictions.
    - `max`: Maximum length of the input.
    - `min`: Minimum length of the input.
  * `regexp`: Validation through regular expression.
    - `value`: The value of the regular expression.

### Handling errors

When the validation process is running, you can set up custom error dialogs that will help user to complete correctly the form. That's as simple as adding `onError` property inside the JSON form.

### Validation example

```json

{
  "items": [
    {
      "type": "page",
      "title": "This is my BIG HEADER",
      "subtitle": "This is the sub-header for little clarifications, etc...",
      "items": [
        {
          "type": "input",
          "title": "Tell us your email",
          "subtitle": "We need your emal to send you notifications",
          "name": "username",
          "onError": "Please, let us know your email!",
          "validations": [
            {
              "type": "text",
              "list": [
                "email",
                "contains:gmail.com"
              ]
            }
          ]
        }
      ]
    }
  ]
}

```

This is an example of a JSON form that you can use to get the email of the user and validated. The text provided must be an email that contains `gmail.com`. If the text provided doesn't pass the validation, the custon error `Please, let us know your email!` will be displayed to the user below the input element.

**OBSERVATION:** You can set multiple validations in there.

### Adding custom validations

You can set up your own validation tests in order to extend the functionality and even override the built-in validations. You just need to do this in your javascript code:

```javascript

  var form = new Form(...); /// You need to instantiate this properly

  form.addValidation('myCustomValidation', function(data) {
    if ( data.length > 5 ) {
      return false;
    } else if ( data.length === 0 ) {
      return true;
    } else {
      return data[0] === '@';
    }
  });

```