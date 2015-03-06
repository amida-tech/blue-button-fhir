"use strict";

var bbu = require('blue-button-util');
var bbjson2json = require('blue-button-json2json');

var rootLogger = require('../logger');

var bbuobject = bbu.object;

var logger = rootLogger.child({
    module: 'engine'
});

exports.instance = function (resourceDict) {
    var json2jsonOverrides = {
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
        },
        resourceDict: resourceDict,
        logger: logger
    };

    var result = bbjson2json.instance(json2jsonOverrides);
    return result;
};
