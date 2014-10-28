'use strict';
var _ = require('lodash');
var ramlMocker = require('../src/index.js');
ramlMocker.generate();
ramlMocker.generate({
    path: 'test/raml',
    formats: {
        Bar: function foo(Faker, schema) {
            return 'BAR';
        }
    }
}, function (methods) {
    console.log(methods);
    _.each(methods, function (m) {
        console.log(m.mock());
    });
});
