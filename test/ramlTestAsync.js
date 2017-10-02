var ramlMocker = require('..');
var options = {
    path: 'test/raml'
};
var callback = function (requests){
    console.log(requests);
};
ramlMocker.generate(options, callback);
