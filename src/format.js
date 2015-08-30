'use strict';
var _ = require('lodash');
var faker = require('faker');

var defaultFormats = {
    'id': function (faker, schema) {
        if (schema.type && schema.type.toLowerCase() === 'string') {
            return faker.lorem.words(5).join('');
        } else {
            return faker.random.number(999999999);
        }
    },
    'email': function (faker) {
        return faker.internet.email();
    },
    'hostname': function (faker) {
        return faker.internet.domainName();
    },
    'ipv4': function (faker) {
        return faker.internet.ip();
    },
    'uri': function (faker) {
        return faker.internet.url();
    },
    'date': function (faker) {
        return faker.date.recent();
    },
    'timestamp': function (faker) {
        return new Date(faker.date.recent(20)).getTime();
    },
    'url': function (faker) {
        return faker.image.imageUrl();
    },
    'uuid': function (faker) {
        return faker.random.uuid();
    },
    'number': function (faker) {
        return faker.random.number();
    },
    'avatar': function (faker) {
        return faker.image.avatar();
    }
    'avatar': function (faker) {
        return faker.image.avatar();
    }


};

var FormatMocker = function (formats) {
    if (_.isUndefined(formats)) {
        formats = {};
    }
    formats = _.defaults(formats, defaultFormats);
    return {
        format: function (format, schema) {
            var result;
            if (typeof (formats[format]) === 'function') {
                result = formats[format](faker, schema);
            } else if (typeof (formats[format.toLowerCase()]) === 'function') {
                result = formats[format.toLowerCase()](faker, schema);
            }
            return result;
        }
    };
};

module.exports = FormatMocker;
