'use strict';
var _ = require('lodash');
var ramlMocker = require('../src/index.js');
ramlMocker.generate({
    path: 'test/raml'
}, function (methods) {
    console.log(methods);
    _.each(methods, function (m) {
        console.log(m.mock());
    });
});
