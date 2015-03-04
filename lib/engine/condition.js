"use strict";

var bbu = require('blue-button-util');

var engine = require('./index');

var rootLogger = require('../logger');

var bbuobject = bbu.object;

var logger = rootLogger.child({
    module: 'condition'
});

var property = exports.property = function (property) {
    if (property) {
        var pieces = property.split('.');
        if (pieces.length > 0) {
            return function (input) {
                if (input) {
                    return pieces.every(function (piece) {
                        if (!input.hasOwnProperty(piece)) {
                            return false;
                        }
                        input = input[piece];
                        if (input === null || input === undefined) {
                            return false;
                        }
                        return true;
                    });
                } else {
                    logger.fatal({
                        property: property
                    }, 'invalid input');
                    return false;
                }
            };
        } else {
            return function (input) {
                if (input) {
                    return input.hasOwnProperty(property);
                } else {
                    logger.fatal('invalid input');
                    logger.fatal({
                        property: property
                    }, 'invalid input');
                    return false;
                }
            };
        }
    } else {
        return null;
    }
};

exports.noProperty = function (p) {
    var fn = property(p);
    return function (input) {
        return !fn(input);
    };
};

exports.noProperties = function (properties) {
    var fns = properties.map(function (p) {
        return property(p);
    });
    return function (input) {
        var some = fns.some(function (fn) {
            return fn(input);
        });
        return !some;
    };
};

exports.propertyValue = function (property) {
    return function (input) {
        return bbuobject.deepValue(input, property);
    };
};

exports.falsyPropertyValue = function (property) {
    return function (input) {
        return !bbuobject.deepValue(input, property);
    };
};

exports.and = function (fns) {
    return function (input) {
        return fns.every(function (fn) {
            return fn(input);
        });
    };
};

exports.or = function (fns) {
    return function (input) {
        return fns.some(function (fn) {
            return fn(input);
        });
    };
};
