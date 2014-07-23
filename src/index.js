'use strict';
var path = require('path'),
    fs = require('fs'),
    async = require('async'),
    raml = require('raml-parser'),
    _ = require('lodash'),
    schemaMocker = require('./schema.js');

function generate(options, callback) {
    if (options && options.path) {
        generateFromPath(options.path, callback);
    }
}

function generateFromPath(filesPath, callback) {
    fs.readdir(filesPath, function (err, files) {
        if (err) {
            throw err;
        }
        files = files.filter(function (file) {
            return file.substr(-5) === '.raml';
        });
        var methods = {};
        async.each(files, function (file, cb) {
            raml.loadFile(path.join(filesPath, file)).then(function (data) {
                var m = getRamlMethods(data, '/');
                methods = _.extend(methods, m);
                cb();
            }, function (error) {
                cb('Error parsing: ' + error);
            });
        }, function (err) {
            if (err) {
                console.log(err);
            } else {
                callback(methods);
            }
        });
    });
}

function getRamlMethods(definition, uri) {
    var methods = {};
    if (definition.relativeUri) {
        var nodeURI = definition.relativeUri;
        if (definition.uriParameters) {
            _.each(definition.uriParameters, function (uriParam, name) {
                nodeURI = nodeURI.replace('{' + name + '}', ':' + name);
            });
        }
        uri = (uri + '/' + nodeURI).replace(/\/{2,}/g, '/');
    }
    if (definition.methods) {
        _.each(definition.methods, function (method) {
            if (method.method && /get|post|put|delete/i.test(method.method) && method.responses && method.responses[200] && method.responses[200].body && method.responses[200].body['application/json'] && method.responses[200].body['application/json'].schema) {
                try {
                    var schema = JSON.parse(method.responses[200].body['application/json'].schema);
                    methods[uri] = {
                        method: method.method,
                        callback: function (req, res) {
                            var response = schemaMocker(schema);
                            res.send(response);
                        }
                    };
                } catch (exception) {
                    console.log(exception.stack);
                }
            }
        });
    }
    if (definition.resources) {
        _.each(definition.resources, function (def) {
            methods = _.extend(methods, getRamlMethods(def, uri));
        });
    }
    return methods;
}
module.exports = {
    generate: generate
};
