'use strict';
var _ = require('lodash');
var RequestMocker = function (uri, method) {
    this.uri = uri;
    this.method = method;
    this.responses = {};
    this.examples = {};
};
RequestMocker.prototype = _.extend(RequestMocker.prototype, {
    mockByCode: function (code) {
        if (!_.isUndefined(this.responses[code])) {
            return this.responses[code]();
        } else {
            throw 'Code not defined in responses';
        }
    },
    exampleByCode: function (code) {
        if (!_.isUndefined(this.examples[code])) {
            return this.examples[code]();
        } else {
            throw 'Code not defined in examples';
        }
    },
    getResponses: function () {
        return this.responses;
    },
    getExamples: function () {
        return this.examples;
    },
    addResponse: function (code, responseFunction, exampleFunction) {
        this.responses[code] = responseFunction;
        this.examples[code] = exampleFunction;
    }
});

module.exports = RequestMocker;
