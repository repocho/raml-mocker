'use strict';
var dataMocker = require('../src/schema.js');
var schema = {
    'type': 'object',
    'description': 'activity info',
    'properties': {
        'state': {
            'type': 'String',
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
        },
        'bar': {
            'type': 'string',
            'format': 'Bar'
        }
    },
    'required': ['state', 'deadline', 'remainDays', 'test', 'foo', 'bar']
};

var formats = {
    foo: function foo(Faker, schema) {
        return Faker.name.firstName();
    },
    Bar: function foo(Faker, schema) {
        return 'BAR';
    }
};
console.log(dataMocker(schema, formats));
