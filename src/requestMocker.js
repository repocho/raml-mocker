'use strict';
var _ = require('lodash');
var RequestMocker = function (uri, method) {
    this.uri = uri;
    this.method = method;
    this.responses = {};
};
RequestMocker.prototype = _.extend(RequestMocker.prototype, {
    mockByCode: function (code) {
        if (!_.isUndefined(this.responses[code])) {
            return this.responses[code]();
        } else {
            throw 'Code not defined in responses';
        }
    },
    getResponses: function () {
        return this.responses;
    },
    addResponse: function (code, fun) {
        this.responses[code] = fun;
    }
});

module.exports = RequestMocker;
