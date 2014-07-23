'use strict';
var _ = require('lodash');
var loremIpsum = require('lorem-ipsum');
var Mockjs = require('mockjs');
var MockRandom = Mockjs.Random;
var FormatMocker = require('./format');

var DataMocker = function (schema, formats) {
    var formatMocker = new FormatMocker(formats);
    var mocker = new Mocker();
    mocker.formatMocker = formatMocker;
    return mocker._mocker(schema);
};

var Mocker = function () {
    return {
        _mocker: function (schema) {
            if (schema.enum && schema.enum.length > 0) {
                return schema.enum[_.random(0, schema.enum.length - 1)];
            } else if (schema.format) {
                var format = schema.format.toLowerCase();
                var formatRet = this.formatMocker.format(format, schema);
                if (formatRet !== undefined) {
                    return formatRet;
                }
            } else if (schema.allOf || schema.anyOf || schema.oneOf || schema.not) {
                // TODO
                return undefined;
            } else if (schema.type) {
                var type = schema.type.toLowerCase();
                if (_.isArray(type)) {
                    type = type[0].toLowerCase();
                }
                if (typeof (this[type + 'Mocker']) !== 'undefined') {
                    var ret = this[type + 'Mocker'](schema);
                    return ret;
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        },

        objectMocker: function (schema) {
            var ret = {};
            var self = this;
            /**
             * maxProperties
             * minProperties
             * required
             * additionalProperties, properties and patternProperties
             * dependences
             */
            if (schema.properties) {
                _.each(schema.properties, function (value, key) {
                    ret[key] = self._mocker(value);
                });
            }
            return ret;
        },

        arrayMocker: function (schema) {
            var ret = [];
            var self = this;
            /**
             * additionalItems and items
             * maxItems
             * minItems
             * uniqueItems
             */
            if (_.isArray(schema.items)) {
                _.each(schema.items, function (item) {
                    ret.push(self._mocker(item));
                });
            } else if (_.isObject(schema.items)) {
                var size = _.random(schema.minItems || 1, schema.maxItems || 5);
                _.times(size, function () {
                    ret.push(self._mocker(schema.items));
                });
            }
            return ret;
        },

        stringMocker: function (schema) {
            /**
             * maxLength
             * minLength
             * enum
             * pattern
             * @type {string}
             */
            var ret = null;
            var strLen = MockRandom.integer(schema.minLength || 1, schema.maxLength || ((schema.minLength || 0) < 50 ? 50 : schema.minLength));
            ret = loremIpsum({
                count: strLen
            }).substring(0, strLen).trim();
            return ret;
        },

        /**
         * @param number
         * @param len
         * @private
         */
        _toFloat: function (number, len) {
            var num = String(number);
            var dotIndex = num.indexOf('.');
            if (dotIndex > 0) {
                num = num.substring(0, dotIndex + len + 1);
            }
            return parseFloat(num);
        },

        /**
         * @param num
         * @returns {number}
         * @private
         */
        _getMinFloat: function (num) {
            var ret = /\.(0*)\d*$/.exec(num);
            return ret ? ret[1].length + 1 : 1;
        },

        /**
         * @param schema
         * @param {Boolean} floating
         * @returns {null}
         * @private
         */
        _numberMocker: function (schema, floating) {
            var ret = null;
            /**
             * multipleOf
             * maximum and exclusiveMaximum
             * minimum and exclusiveMinimum
             */
            if (schema.multipleOf) {
                var multipleMin = 1;
                var multipleMax = 5;

                if (schema.maximum !== undefined) {
                    if ((schema.maximum === schema.multipleOf && !schema.exclusiveMaximum) || (schema.maximum > schema.multipleOf)) {
                        multipleMax = Math.floor(schema.maximum / schema.multipleOf);
                    } else {
                        multipleMin = 0;
                        multipleMax = 0;
                    }
                }
                ret = schema.multipleOf * MockRandom.integer(multipleMin, multipleMax);
            } else {
                var minimum = schema.minimum || 0;
                var maximum = schema.maximum || 9999;
                var gap = maximum - minimum;
                /**
                 *  - min: 0.000006
                 *  - max: 0.000009
                 */
                var minFloat = this._getMinFloat(minimum);
                minFloat = minFloat < this._getMinFloat(maximum) ? this._getMinFloat(maximum) : minFloat;
                var maxFloat = minFloat + _.random(0, 2);
                var littleGap = this._toFloat(_.random(0, gap, floating), _.random(minFloat, maxFloat)) / 10;
                ret = this._toFloat(_.random(minimum, maximum, floating), _.random(minFloat, maxFloat));
                if (ret === schema.maximum && schema.exclusiveMaximum) {
                    ret -= littleGap;
                }
                if (ret === schema.minimum && schema.exclusiveMinimum) {
                    ret += littleGap;
                }
            }
            return ret;
        },

        numberMocker: function (schema) {
            return this._numberMocker(schema, true);
        },

        integerMocker: function (schema) {
            return this._numberMocker(schema, false);
        },

        booleanMocker: function (schema) {
            return MockRandom.boolean();
        },

        nullMocker: function (schema) {
            return null;
        }
    };
};

module.exports = DataMocker;
