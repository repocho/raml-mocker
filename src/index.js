/* global app, express*/
'use strict';
var path = require('path'),
    ramlHTMLPath = path.join(__dirname, '../../restDefinitions/html'),
    ramlPath = path.join(__dirname, '../../restDefinitions/'),
    fs = require('fs'),
    async = require('async'),
    raml = require('raml-parser'),
    schemaMocker = require('json-schema-mock');
app.use('/raml', express.static(ramlHTMLPath));

fs.readdir(ramlPath, function (err, files) {
    files = files.filter(function (file) {
        return file.substr(-5) === '.raml';
    });
    async.each(files, function (file, callback) {
        raml.loadFile(path.join(ramlPath, file)).then(function (data) {
            getRamlMethods(data, '/rest');
            callback();
        }, function (error) {
            callback('Error parsing: ' + error);
        });
    }, function (err) {
        if (err) {
            console.log(err);
        }
    });

});

function getRamlMethods(definition, uri) {
    if (definition.relativeUri) {
        var nodeURI = definition.relativeUri;
        if (definition.uriParameters) {
            _.each(definition.uriParameters, function (uriParam, name) {
                nodeURI = nodeURI.replace('{' + name + '}', ':' + name);
            });
        }
        uri = path.join(uri, nodeURI);
    }
    if (definition.methods) {
        _.each(definition.methods, function (method) {
            if (method.method && /get|post|put|delete/i.test(method.method) && method.responses && method.responses[200] && method.responses[200].body && method.responses[200].body['application/json'] && method.responses[200].body['application/json'].schema) {
                try {
                    var schema = JSON.parse(method.responses[200].body['application/json'].schema);
                    app[method.method](uri, function (req, res) {
                        var response = schemaMocker(schema);
                        res.send(response);
                    });
                    console.log('Created request: ' + method.method + ' - ' + uri);
                } catch (exception) {
                    console.log(exception.stack);
                }
            }
        });
    }
    if (definition.resources) {
        _.each(definition.resources, function (def) {
            getRamlMethods(def, uri);
        });
    }
}
