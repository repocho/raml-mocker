'use strict';
var MockJS = require('mockjs');

var FormatMocker = function (format) {
    var result;
    switch (format) {
    case 'email':
        result = MockJS.Random.email();
        break;
    case 'hostname':
        result = MockJS.Random.domain();
        break;
    case 'ipv4':
        result = MockJS.Random.ip();
        break;
    case 'uri':
        result = MockJS.Random.url();
        break;
    case 'date':
        result = MockJS.Random.datetime();
        break;
    case 'timestamp':
        result = Date.now() + MockJS.Random.integer(-864000000, +864000000);
        break;
    case 'url':
        result = MockJS.Random.url();
        break;
    }
    return result;
};

module.exports = FormatMocker;
