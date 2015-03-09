"use strict";

var bbu = require('blue-button-util');
var bbjson2json = require('blue-button-json2json');

var rootLogger = require('./logger');

var bbuobject = bbu.object;

var logger = rootLogger.child({
    module: 'json2Json'
});

var overrideMethods = {
    dataKeyPieceOverride: function (input, dataKeyPiece) {
        if (dataKeyPiece === 'reference') {
            var id = input;
            input = this.resourceDict[input];
            if (!bbuobject.exists(input)) {
                logger.debug({
                    missingResource: id
                });
                return null;
            }
            return input;
        } else {
            return input;
        }
    }
};

exports.instance = function (resourceDict) {
    var overrides = {
        dataKeyPieceOverride: overrideMethods.dataKeyPieceOverride,
        resourceDict: resourceDict,
        logger: logger
    };

    var result = bbjson2json.instance(overrides);
    return result;
};
