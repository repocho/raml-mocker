var ramlMocker = require('..');
var options = {
    path: 'test/raml1'
};
var callback = function (requests){
    _.each(requests, function(item) {
    	console.log(item);
    })
};
ramlMocker.generate(options, callback);