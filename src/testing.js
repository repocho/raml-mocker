/* global */
'use strict';
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
            'description': 'deadline of the activity'
        },
        'remainDays': {
            'type': 'integer',
            'description': 'days left.'
        }
    },
    'required': ['state', 'deadline', 'remainDays', 'needDays', 'seasonNum']
};

console.log(DataMocker(schema));
