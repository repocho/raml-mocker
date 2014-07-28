raml-mocker [![Build Status](https://travis-ci.org/RePoChO/raml-mocker.svg?branch=master)](https://travis-ci.org/RePoChO/raml-mocker) [![NPM version](https://badge.fury.io/js/raml-mocker.svg)](http://badge.fury.io/js/raml-mocker) [![Dependency Status](https://gemnasium.com/RePoChO/raml-mocker.svg)](https://gemnasium.com/RePoChO/raml-mocker)
===========

Node module to create random 200 responses to requests based on RAML rest definition.



Objective
---
The goal of this plugin is to provide automatics mocked responses based on REST contracts defined in a project. This RAML rest contracts are evaluated and the plugin provides a functions to generate random responses.

The RAML files should contain for each request you want to mock a 200 response HTTP code, application/json and a valid json schema.



GETTING STARTED
---
  - Yo need to define a RAML file like this: [definition.raml]
  - Take care the schema file import or define inside the raml file.
  -


HOW TO USE RAML MOCKER
---
```javascript
var ramlMocker = require('raml-mocker');
var options = {
    path: 'test/raml'
};
var callback = function (requests){
    console.log(requests);
};
ramlMocker.generate(options, callback);
```
Or defining instead of a path a collection of files:
```javascript
var options = {
    files: ['definition1.raml', 'folder/definition2.raml']
};
```
If your properties in schema needs a alternative logic you should use *format*. For example the schema in [schemaTest]:
```javascript
'foo': {
    'type': 'string',
    'format': 'foo'
}
```
And in your options provide a formats definitions:
```javascript
var options = {
    path: 'test/raml',
    formats : {
        foo: function foo(Faker, schema) {
            return Faker.Name.firstName();
        }
    }
};
```
As you could see the random generation is based on [faker], so the function to generate a specific format receives the faker object and the schema. You can use Faker for doing the logic (check the documentation).f

And the RESULT in your callback
---
This generate request will return an array like this:
```javascript
[
    {
        uri: '/test/:id/objectDef'
        method: 'get',
        mock: [Function]
    }
]
```
If you has [express] and [underscore] or [lodash] in your project. You can use a callback like this to create the mocked requests:
```javascript
var callback = function (requestsToMock){
    _.each(requestsToMock, function(reqToMock){
        app[reqToMock.method](reqToMock.uri, function(req,res){
            res.send(reqToMock.mock());
        });
    });
};
```


TODO
---
There are a lot of things TODO, this plugin is only the first step in the RAML generation and the SCHEMA generation. If you wanna colaborate don't hesitate to request it or do a fork + pull requests.

The idea and some of the schema.js code is based in [json-schema-mock].

[definition.raml]:https://github.com/RePoChO/raml-mocker/blob/master/test/raml/definition.raml
[schemaTest]:https://github.com/RePoChO/raml-mocker/blob/master/test/schemaTest.js
[express]:https://www.npmjs.org/package/express
[underscore]:https://www.npmjs.org/package/underscore
[lodash]:https://www.npmjs.org/package/lodash
[faker]:https://github.com/Marak/Faker.js
[json-schema-mock]:https://www.npmjs.org/package/json-schema-mock
