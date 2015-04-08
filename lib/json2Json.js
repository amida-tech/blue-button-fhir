"use strict";

var bbu = require('blue-button-util');
var bbjson2json = require('blue-button-json2json');

var rootLogger = require('./logger');

var bbuobject = bbu.object;

var logger = rootLogger.child({
    module: 'json2Json'
});

exports.instance = function (resourceDict) {
    var getResource = function (input) {
        var id = input;
        input = resourceDict[id];
        if (!bbuobject.exists(input)) {
            logger.debug({
                missingResource: id
            });
            return null;
        }
        return input;
    };

    var overrides = {
        dataKeyFnOptions: {
            getResource: getResource
        },
        resourceDict: resourceDict,
        logger: logger
    };

    var result = bbjson2json.instance(overrides);
    return result;
};
