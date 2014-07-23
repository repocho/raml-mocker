'use strict';
var dataMocker = require('../src/schema.js');
var schema = {
    'type': 'object',
    'description': 'activity info',
    'properties': {
        'state': {
            'type': 'string',
            'description': 'current activity state',
            'enum': ['wait', 'process', 'over']
        },
        'deadline': {
            'type': 'number',
            'format': 'timestamp',
            'description': 'deadline of the activity'
        },
        'remainDays': {
            'type': 'integer',
            'description': 'days left.'
        },
        'test': {
            'type': 'string',
            'description': 'a string'
        },
        'foo': {
            'type': 'string',
            'format': 'foo'
        }
    },
    'required': ['state', 'deadline', 'remainDays', 'needDays', 'seasonNum']
};

var formats = {
    foo: function foo(Faker, schema) {
        return Faker.Name.firstName();
    }
};
console.log(dataMocker(schema, formats));
