'use strict';
var ramlMocker = require('../src/index.js');
ramlMocker.generate({
    path: './raml'
}, function (methods) {
    console.log(methods);
});
