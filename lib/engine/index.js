"use strict";

var bbu = require('blue-button-util');
var bbm = require('blue-button-meta');
var lodash = require('lodash');

var rootLogger = require('../logger');

var bbudatetime = bbu.datetime;
var bbuobject = bbu.object;
var bbuobjectset = bbu.objectset;
var code_systems = bbm.code_systems;

var logger = rootLogger.child({
    module: 'engine'
});

var enginePrototype = {
    moveAlongPath: function (input, path) {
        if (bbuobject.exists(input) && path) {
            if (Array.isArray(path)) {
                for (var k = 0; k < path.length; ++k) {
                    var v = this.moveAlongPath(input, path[k]);
                    if (bbuobject.exists(v)) {
                        return v;
                    }
                }
                return null;
            } else {
                var pathPieces = path.split('.');
                var n = pathPieces.length;
                for (var i = 0; i < n; ++i) {
                    var pathPiece = pathPieces[i];
                    input = input[pathPiece];
                    logger.debug({
                        gcoPath: path
                    }, {
                        gcpPathPiece: pathPiece
                    }, {
                        gco: input
                    });
                    if (!bbuobject.exists(input)) {
                        return null;
                    } else if ((i < n - 1) && Array.isArray(input) && (pathPieces[i + 1] !== '0')) {
                        var remainingPath = pathPieces.splice(i + 1).join('.');
                        var result = [];
                        for (var j = 0; j < input.length; ++j) {
                            var premResult = this.moveAlongPath(input[j], remainingPath);
                            if (premResult !== null && premResult !== undefined) {
                                result.push(premResult);
                            }
                        }
                        if (result.length > 0) {
                            return result;
                        } else {
                            return null;
                        }
                    } else if (pathPiece === 'reference') {
                        var id = input;
                        input = this.resourceDict[input];
                        if (!bbuobject.exists(input)) {
                            logger.debug({
                                missingResource: id
                            });
                            return null;
                        }
                    }
                }
            }
        }
        return input;
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
            input = this.moveAlongPath(input, template.dataKey);
            if (input === null) {
                return null;
            }
        }
        var that = this;
        if (Array.isArray(input) && (template.content || template.value)) {
            var modifiedTemplate = {}; // dataTransform tags only apply to the array
            if (template.content) {
                modifiedTemplate.content = template.content;
            }
            if (template.value) {
                modifiedTemplate.value = template.value;
            }
            var fullResult = input.reduce(function (r, e) {
                var result = that.run(modifiedTemplate, e);
                if (result !== null) {
                    r.push(result);
                }
                return r;
            }, []);
            if (fullResult.length > 0) {
                return fullResult;
            } else {
                return null;
            }
        }
        if (template.content) {
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
        } else if (template.constant) {
            return template.constant;
        } else if (template.value) {
            var v = that.evaluateValue(template.value, input);
            if (v !== null && template.multiple) {
                return [v];
            }
            return v;
        }
        return input;
    }
};

exports.instance = function (resourceDict) {
    var result = Object.create(enginePrototype);
    result.resourceDict = resourceDict;
    return result;
};

exports.condition = require('./condition');
