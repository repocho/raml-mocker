'use strict';
var request = require('request'),
    path = require('path'),
    fs = require('fs'),
    async = require('async'),
    raml = require('raml-parser'),
    _ = require('lodash'),
    jsonSchema = require('json-schema'),
    schemaMocker = require('./schema.js');

function generate(options, callback) {
    var formats = {};
    if (options) {
        if (options.formats) {
            formats = options.formats;
        }
        if (!callback || !_.isFunction(callback)) {
            console.error('[RAML-MOCKER] You must define a callback function:\n');
            showUsage();
        }
        try {
            if (options.path) {
                generateFromPath(options.path, formats, callback);
            } else if (options.files && _.isArray(options.files)) {
                generateFromFiles(options.files, formats, callback);
            }
        } catch (exception) {
            console.error('[RAML-MOCKER] A runtime error has ocurred:\n');
            console.error(exception.stack);
            showUsage();
        }
    } else {
        console.error('[RAML-MOCKER] You must define a options object:\n');
        showUsage();
    }
}

function showUsage() {
    console.log('--------------------------------------------------------------------');
    console.log('---------------------- HOW TO USE RAML MOCKER ----------------------');
    console.log('--  var ramlMocker = require(\'raml-mocker\');                      --');
    console.log('--  var options = { path: \'test/raml\' };                          --');
    console.log('--  var callback = function (requests){ console.log(requests); }; --');
    console.log('--  ramlMocker.generate(options, callback);                       --');
    console.log('--------------------------------------------------------------------');
}

function generateFromPath(filesPath, formats, callback) {
    fs.readdir(filesPath, function (err, files) {
        if (err) {
            throw err;
        }
        var filesToGenerate = [];
        _.each(files, function (file) {
            if (file.substr(-5) === '.raml') {
                filesToGenerate.push(path.join(filesPath, file));
            }
        });
        generateFromFiles(filesToGenerate, formats, callback);
    });
}

function generateFromFiles(files, formats, callback) {
    var requestsToMock = [];
    async.each(files, function (file, cb) {
        raml.loadFile(file).then(function (data) {
            getRamlRequestsToMock(data, '/', formats, function (reqs) {
                requestsToMock = _.union(requestsToMock, reqs);
                cb();
            });
        }, function (error) {
            cb('Error parsing: ' + error);
        });
    }, function (err) {
        if (err) {
            console.log(err);
        } else {
            callback(requestsToMock);
        }
    });
}

function getRamlRequestsToMock(definition, uri, formats, callback) {
    var requestsToMock = [];
    if (definition.relativeUri) {
        var nodeURI = definition.relativeUri;
        if (definition.uriParameters) {
            _.each(definition.uriParameters, function (uriParam, name) {
                nodeURI = nodeURI.replace('{' + name + '}', ':' + name);
            });
        }
        uri = (uri + '/' + nodeURI).replace(/\/{2,}/g, '/');
    }
    var tasks = [];
    if (definition.methods) {
        tasks.push(function (cb) {
            getRamlRequestsToMockMethods(definition, uri, formats, function (reqs) {
                requestsToMock = _.union(requestsToMock, reqs);
                cb();
            });
        });
    }
    if (definition.resources) {
        tasks.push(function (cb) {
            getRamlRequestsToMockResources(definition, uri, formats, function (reqs) {
                requestsToMock = _.union(requestsToMock, reqs);
                cb();
            });
        });
    }
    async.parallel(tasks, function (err) {
        if (err) {
            throw err;
        }
        callback(requestsToMock);
    });
}

function getRamlRequestsToMockMethods(definition, uri, formats, callback) {
    async.map(definition.methods, function (method, cb) {
        if (method.method && /get|post|put|delete/i.test(method.method) && method.responses && method.responses[200] && method.responses[200].body && method.responses[200].body['application/json'] && method.responses[200].body['application/json'].schema) {
            try {
                var schema = JSON.parse(method.responses[200].body['application/json'].schema);
                if (schema) {
                    var $schema = schema.$schema;
                    if ($schema) {
                        request({
                            url: $schema,
                            json: true
                        }, function (error, response, masterSchema) {
                            if (!error && response.statusCode === 200) {
                                delete schema.$schema;
                                var report = jsonSchema.validate(schema, masterSchema);
                                if (report.errors.length === 0) {
                                    //JSON is valid against the schema
                                    cb(null, {
                                        uri: uri,
                                        method: method.method,
                                        mock: function () {
                                            return schemaMocker(schema, formats);
                                        }
                                    });
                                } else {
                                    console.log(report.errors);
                                    cb(report.errors);
                                }
                            }
                        });

                    }
                }
            } catch (exception) {
                cb(exception.stack);
            }
        }
    }, function (err, results) {
        if (err) {
            throw err;
        }
        callback(results);
    });

}

function getRamlRequestsToMockResources(definition, uri, formats, callback) {
    var requestsToMock = [];
    async.each(definition.resources, function (def, cb) {
        getRamlRequestsToMock(def, uri, formats, function (reqs) {
            requestsToMock = _.union(requestsToMock, reqs);
            cb(null);
        });
    }, function (err) {
        if (err) {
            throw err;
        }
        callback(requestsToMock);
    });
}
module.exports = {
    generate: generate
};
