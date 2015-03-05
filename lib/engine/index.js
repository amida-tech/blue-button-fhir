"use strict";

var bbu = require('blue-button-util');

var rootLogger = require('../logger');

var bbuobject = bbu.object;
var bbuobjectset = bbu.objectset;

var logger = rootLogger.child({
    module: 'engine'
});

var enginePrototype = {
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
    dataKeyArrayOverride: function (input, dataKeyPieces, dataKeyIndex) {
        var n = dataKeyPieces.length;
        if (dataKeyIndex >= n - 1) {
            return input;
        }
        if (dataKeyPieces[dataKeyIndex + 1] === '0') {
            input = input[0];
            if (dataKeyIndex + 1 >= n - 1) {
                return input;
            }
            var piecesAfter0 = dataKeyPieces.slice(dataKeyIndex + 2, n).join('.');
            return this.dataKeyToInput(input, piecesAfter0);
        }

        var remainingDataKey = dataKeyPieces.slice(dataKeyIndex + 1, n).join('.');
        return this.dataKeyToInputForArray(input, remainingDataKey);
    },
    dataKeyToInputForArray: function (input, dataKey) {
        var result = [];
        for (var i = 0; i < input.length; ++i) {
            var premResult = this.dataKeyToInput(input[i], dataKey);
            if (bbuobject.exists(premResult)) {
                result.push(premResult);
            }
        }
        if (result.length > 0) {
            return result;
        } else {
            return null;
        }
    },
    dataKeyToInput: function (input, dataKey) {
        if (!bbuobject.exists(input)) {
            return null;
        }
        if (!bbuobject.exists(dataKey)) {
            return input;
        }
        var dataKeyPieces = dataKey.split('.');
        var n = dataKeyPieces.length;
        for (var i = 0; i < n; ++i) {
            var pathPiece = dataKeyPieces[i];
            input = input[pathPiece];
            if (!bbuobject.exists(input)) {
                return null;
            }
            input = this.dataKeyPieceOverride(input, pathPiece);
            if (Array.isArray(input)) {
                return this.dataKeyArrayOverride(input, dataKeyPieces, i);
            }
        }
        return input;
    },
    dataKeyArrayToInput: function (input, dataKeyArray) {
        var n = dataKeyArray.length;
        for (var i = 0; i < n; ++i) {
            var dataKey = dataKeyArray[i];
            var inputCandidate = this.dataKeyToInput(input, dataKey);
            if (bbuobject.exists(inputCandidate)) {
                return inputCandidate;
            }
        }
        return null;
    },
    evaluateDataKey: function (input, dataKey) {
        if (!bbuobject.exists(input)) {
            return null;
        }
        if (!bbuobject.exists(dataKey)) {
            return input;
        }
        if (Array.isArray(dataKey)) {
            return this.dataKeyArrayToInput(input, dataKey);
        } else {
            return this.dataKeyToInput(input, dataKey);
        }
    },
    evaluateValue: function (value, input) {
        var valueType = (typeof value);
        if (valueType === 'function') {
            return value(input);
        } else if (valueType === 'object') {
            return this.run(value, input);
        } else {
            return value;
        }
    },
    content: function (template, input) {
        var that = this;
        var content = template.content;
        var hasValue = false;
        var keys = Object.keys(content);
        var result = keys.reduce(function (r, key) {
            var contentValue = template.content[key];
            var value = that.evaluateValue(contentValue, input);
            if (value !== null) {
                bbuobjectset.deepValue(r, key, value);
                hasValue = true;
            }
            return r;
        }, {});
        return hasValue ? result : null;
    },
    value: function (template, input) {
        var v = this.evaluateValue(template.value, input);
        if (v !== null && template.multiple) {
            return [v];
        }
        return v;
    },
    runForArray: function (template, input) {
        var hasActionKeys = false;
        var modifiedTemplate = this.actionKeys.reduce(function (r, actionKey) {
            // dataTransform tags only apply to the array
            if (template[actionKey]) {
                r[actionKey] = template[actionKey];
                hasActionKeys = true;
            }
            return r;
        }, {});
        if (!hasActionKeys) {
            return input;
        }
        var that = this;
        var result = input.reduce(function (r, e) {
            var value = that.run(modifiedTemplate, e);
            if (value !== null) {
                r.push(value);
            }
            return r;
        }, []);
        if (result.length > 0) {
            return result;
        } else {
            return null;
        }
    },
    run: function (template, input) {
        if (!template) {
            logger.fatal('empty template');
            return null;
        }
        if (template.existsWhen && !template.existsWhen(input)) {
            logger.debug({
                arguments: arguments
            }, 'exist when return');
            return null;
        }
        if (template.dataKey) {
            input = this.evaluateDataKey(input, template.dataKey);
            if (input === null) {
                return null;
            }
        }
        if (Array.isArray(input)) {
            return this.runForArray(template, input);
        }
        for (var i = 0; i < this.actionKeys.length; ++i) {
            var actionKey = this.actionKeys[i];
            if (template[actionKey]) {
                return this[actionKey](template, input);
            }
        }
        return input;
    }
};

exports.instance = function (resourceDict) {
    var result = Object.create(enginePrototype);
    result.resourceDict = resourceDict;
    result.actionKeys = ['content', 'value'];
    return result;
};
