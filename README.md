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

## JSON model

The JSON file contains all the fields of the form, including the validation rules, name of the fields and all of the data that you need to show. This is an example of a valid JSON file.

```json

{
  "items": [
    {
      "type": "page",
      "title": "This is an example",
      "subtitle": "This is the subtitle for clarifications etc...",
      "items": [
        {
          "type": "input",
          "name": "username",
          "title": "Your name please",
          "subtitle": "Let us know your name!",
          "onError": "Please, type your name",
          "placeholder": "Type your name here..."
        },
        {
          "type": "radio",
          "name": "userGender",
          "title": "Your gender",
          "subtitle": "",
          "items": [
            "Male",
            "Female",
            "%Other"
          ]
        }
      ]
    }
  ]
}

```

As you can see, this is a very descriptive way to store the information. To see all the components to use and all it's features, please go to the `Components` section.

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

## Components

There are a few components that you can use for your forms. Here is a list:

  * input
  * radio
  * checkbox
  * radioMatrix
  * checkboxMatrix
  * plainText

There are common properties that can be used in each one of them.

  * title: `String`
  * subtitle: `String`
  * name: `String`
  * validations: [ `Validation` ]
  * onError: `String`

### title [String]

The content of the `title` field is the header of the block that contains the current component.

### subtitle [String]

The subtitle goes below of the title but with a tiny font size.

### name [String]

The `name` field is one of the most important fields in the component because is the identifier of the component in the JSON when all the data is collected from the user.

### validations [Validation list]

All kind of validations must be here, even the custom ones. Here you can set up all that you want in order to get a valid data from the user.

### onError [String]

When the validation process is running and the field is not valid or if is missing for some reason, the error message will be the value of this field.

### input [Component]

This component is a single html `input`. You can also set the `placeholder` field for this element.

### radio [Component]

This is a single option selection component. All the element names must be placed at the `items` field. If you want to accept another answer, you must start the item name with a `%` character.

e.g.
```json
{
  "type": "radio",
  "name": "currentCity",
  "title": "Tell us your current city",
  "subtitle": "",
  "items": [
    "New York",
    "L.A",
    "New Jersey",
    "%Other"
  ]
}
```

### checkbox [Component]

This component allows multiple answers. All the element names must be placed at the `items` field.

### radioMatrix [Component]

With this component you can set a matrix where you can group all the answers. The title for all of the columns must be at the `cols` field and the title for all of the rows must be at the `rows` field. You can also set if the answer is by row or by column with the `answerBy` field set to `rows` or `cols`. The default value of the `answerBy` field is `rows`.

e.g.

```json
{
  "type": "radioMatrix",
  "title": "We want to know if you can speak multiple languages",
  "subtitle": "Show us what you're capable of",
  "rows": [
    {
      "name": "english",
      "title": "English"
    },
    {
      "name": "spanish",
      "title": "Español"
    },
    {
      "name": "japanese",
      "title": "Japanese"
    }
  ],
  "cols": [
    {
      "name": "none",
      "title": "I don't understand"
    },
    {
      "name": "little",
      "title": "Just a little"
    },
    {
      "name": "medium",
      "title": "Medium level"
    },
    {
      "name": "expert",
      "title": "Fluid communication"
    }
  ]
}
```

### checkboxMatrix [Component]

This component is similar to the `radioMatrix` but users can select multiple answers.

### plainText [Component]

For this component, the `name`, `validations`, and `onError` fields are not considered when the validation process is running. This field can be used for large clarifications. All the data must be placed at the `content` field.