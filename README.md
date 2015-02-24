raml-mocker [![Build Status](https://travis-ci.org/RePoChO/raml-mocker.svg?branch=master)](https://travis-ci.org/RePoChO/raml-mocker) [![NPM version](https://badge.fury.io/js/raml-mocker.svg)](http://badge.fury.io/js/raml-mocker) [![Dependency Status](https://gemnasium.com/RePoChO/raml-mocker.svg)](https://gemnasium.com/RePoChO/raml-mocker)
===========

Node module to create random responses to requests based on RAML rest definition.



Objective
---
The goal of this plugin is to provide automatic mocked responses that honor your defined RAML REST contracts. These contracts are evaluated and the plugin provides functions to generate random responses.

The RAML files should contain HTTP responses for each request you want to mock, application/json and a valid json schema.



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
If your properties in the schema need an alternative logic you should use *format*. For example the schema in [the test schema] or in [schemaTest]:
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
This generated request will return an array of objects like this:
```javascript
[
    {
        /** URI of the request to mock */
        uri: '/test/:id/objectDef'
        /** Method of the request (get, post, ...) */
        method: 'get',
        /** Function by default to return the mock (codes 2XX defined in the RAML). */
        mock: [Function]
        /** If you don't define a 2XX code or want to use randomly other code responses. You can use this function
          * Just use instead of mock(); -> mockByCode(418);
          */
        mockByCode: [Function](code)
        /** Function by default to return the example (codes 2XX defined in the RAML). */
        example: [Function]
        /** The same as mockByCode but applied to examples */
        exampleByCode: [Function](code)
    }
]
```
If you have [express] and [underscore] or [lodash] in your project, you can use a callback like this to create the mocked requests:
```javascript
var callback = function (requestsToMock){
    _.each(requestsToMock, function(reqToMock){
        app[reqToMock.method](reqToMock.uri, function(req,res){
            var code = 200;
            if (reqToMock.defaultCode) {
                code = reqToMock.defaultCode;
            }
            res.send(code ,reqToMock.mock());
        });
    });
};
```

Json-Schema Support Draft-04
---
**References**

This plugin supports internal references and also references to json files under the working folder of the node process running raml-mocker. For example:
```json
{
    "$schema": "http://json-schema.org/schema",
    "type": "object",
    "properties": {
        "test": {
            "format": "timestamp",
            "$ref": "#/definitions/other"
        }
    },
    "required": ["test"],
    "definitions": {
        "other": {
            "type": "number"
        }
    }
}
```
```json
// schemas/thisSchema.json
{
    "$schema": "http://json-schema.org/schema",
    "type": "object",
    "properties": {
        "test": {
            "format": "timestamp",
            "$ref": "schemas/otherSchema.json#"
        }
    },
    "required": ["test"],
}

// schemas/otherSchema.json
{
    "$schema": "http://json-schema.org/schema",
    "type": "object",
    "properties": {
        "test": {
            "format": "timestamp",
            "type": "integer"
        }
    },
}
```

**Keywords support**

* enum : **✓ yes**
* type: **✓ yes**
* allOf: **✓ yes**
* anyOf: **✓ yes**
* oneOf: **✓ yes**
* not: **NO** (very difficult to generate a random mock from **not** json-schemas)

If you need an example please check [the test schema]


TODO
---
If you have any improvement please open an issue. If you want to collaborate do not hesitate to request it or do a fork + pull requests. I'll be grateful.

Part of the schema.js code is based in [json-schema-mock].

[definition.raml]:https://github.com/RePoChO/raml-mocker/blob/master/test/raml/definition.raml
[the test schema]:https://github.com/RePoChO/raml-mocker/blob/master/test/raml/schemas/objectDefinition.json
[schemaTest]:https://github.com/RePoChO/raml-mocker/blob/master/test/schemaTest.js
[express]:https://www.npmjs.org/package/express
[underscore]:https://www.npmjs.org/package/underscore
[lodash]:https://www.npmjs.org/package/lodash
[faker]:https://github.com/Marak/Faker.js
[json-schema-mock]:https://www.npmjs.org/package/json-schema-mock


#### History Log

##### 0.1.12
- Fixes null responses crash in getResponsesByCode

##### 0.1.11
- JSON schema now supports references to external files.
- Adds the possibility to get also the responses examples defined inside RAML files.

##### 0.1.10
- Allows upper case in the format name definition. Fixes [#1](https://github.com/RePoChO/raml-mocker/issues/1)

##### 0.1.9
- Adds support for uniqueItems schema keyword.

##### 0.1.8
- Adds the possibility to return only the http code without a json.
- Fixes some issues.
- Removes unneeded packages.

##### 0.1.7
- Adds support to multiple http codes per uri & method in raml files.

##### 0.1.6
- Fixes an error without showing it in the console.
