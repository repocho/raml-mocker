raml-mocker [![Build Status](https://travis-ci.org/RePoChO/raml-mocker.svg?branch=master)](https://travis-ci.org/RePoChO/raml-mocker) [![NPM version](https://badge.fury.io/js/raml-mocker.svg)](http://badge.fury.io/js/raml-mocker) [![Dependency Status](https://gemnasium.com/RePoChO/raml-mocker.svg)](https://gemnasium.com/RePoChO/raml-mocker)
===========

Node module to create random 200 responses to requests based on RAML rest definition.



Objective
---
The goal of this plugin is to provide automatic mocked responses that honor your defined RAML REST contracts. These contracts are evaluated and the plugin provides functions to generate random responses.

The RAML files should contain 200 HTTP responses for each request you want to mock, application/json and a valid json schema.



GETTING STARTED
---
  - Yo need to define a RAML file like this: [definition.raml]
  - Import the json-schema file or define it inside the raml file.
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
Or defining a collection of files instead of a path:
```javascript
var options = {
    files: ['definition1.raml', 'folder/definition2.raml']
};
```
If your properties in the schema need an alternative logic you should use *format*. For example the schema in [schemaTest]:
```javascript
'foo': {
    'type': 'string',
    'format': 'foo'
}
```
And in your options provide format definitions:
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
As you could see the random generation is based on [faker], so the function to generate a specific format receives the faker object and the schema. You can use Faker for implementing the logic (check the documentation).

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
If you have [express] and [underscore] or [lodash] in your project, you can use a callback like this to create the mocked requests:
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
There are lots of things TODO, this plugin is only the first step in the RAML generation and the SCHEMA generation. If you want to colaborate do not hesitate to request it or do a fork + pull requests.

Part of the schema.js code is based in [json-schema-mock].

[definition.raml]:https://github.com/RePoChO/raml-mocker/blob/master/test/raml/definition.raml
[schemaTest]:https://github.com/RePoChO/raml-mocker/blob/master/test/schemaTest.js
[express]:https://www.npmjs.org/package/express
[underscore]:https://www.npmjs.org/package/underscore
[lodash]:https://www.npmjs.org/package/lodash
[faker]:https://github.com/Marak/Faker.js
[json-schema-mock]:https://www.npmjs.org/package/json-schema-mock
