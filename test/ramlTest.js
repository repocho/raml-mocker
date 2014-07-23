'use strict';
var ramlMocker = require('../src/index.js');
ramlMocker.generate({
    path: 'test/raml'
}, function (methods) {
    console.log(methods);
});
