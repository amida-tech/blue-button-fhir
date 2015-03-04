"use strict";

var bbu = require('blue-button-util');
var bbm = require('blue-button-meta');
var lodash = require('lodash');

var rootLogger = require('./logger');

var bbudatetime = bbu.datetime;
var bbuobject = bbu.object;
var code_systems = bbm.code_systems;

var logger = rootLogger.child({
    module: 'engine'
});

var enginePrototype = {
    sourceAdapters: {
        date: function (source) {
            return bbudatetime.dateToModel(source);
        },
        datetime: function (source) {
            return bbudatetime.dateTimeToModel(source);
        },
        boolToConstant: function (source, param) {
            var index = source ? 0 : 1;
            return param[index];
        },
        template: function (source, param) {
            return this.run(source, param);
        },
        identity: function (source) {
            return source;
        },
        toString: function (source) {
            return source.toString();
        }
    },
    conditions: {
        truthy: function (source) {
            return source;
        },
        falsy: function (source) {
            return !source;
        }
    },
    setProperty: function (result, property, value) {
        var propertyPieces = property.split('.');
        var source = result;
        var lastIndex = propertyPieces.length - 1;
        for (var i = 0; i < lastIndex; ++i) {
            var propertyPiece = propertyPieces[i];
            var nextObj = source[propertyPiece];
            if (!bbuobject.exists(nextObj)) {
                source[propertyPiece] = nextObj = {};
            } else {
                if ((typeof nextObj !== 'object') || Array.isArray(nextObj)) {
                    logger.warn({
                        existingObjectProperty: propertyPiece
                    });
                    source[propertyPiece] = nextObj = {};
                }
            }
            source = nextObj;
        }
        source[propertyPieces[lastIndex]] = value;
    },
    moveSourceAlongPath: function (source, path) {
        if (bbuobject.exists(source) && path) {
            if (Array.isArray(path)) {
                for (var k = 0; k < path.length; ++k) {
                    var v = this.moveSourceAlongPath(source, path[k]);
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
                    source = source[pathPiece];
                    logger.debug({
                        gcoPath: path
                    }, {
                        gcpPathPiece: pathPiece
                    }, {
                        gco: source
                    });
                    if (!bbuobject.exists(source)) {
                        break;
                    } else if ((i < n - 1) && Array.isArray(source) && (pathPieces[i + 1] !== '0')) {
                        var remainingPath = pathPieces.splice(i + 1).join('.');
                        var result = [];
                        for (var j = 0; j < source.length; ++j) {
                            var premResult = this.moveSourceAlongPath(source[j], remainingPath);
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
                        var id = source;
                        source = this.resourceDict[source];
                        if (!bbuobject.exists(source)) {
                            logger.debug({
                                missingResource: id
                            });
                            break;
                        }
                    }
                }
            }
        }
        return source;
    },
    value: function (source, sourceAdapter, param) {
        if (Array.isArray(source)) {
            var that = this;
            return source.reduce(function (r, e) {
                var v = sourceAdapter.call(that, e, param);
                if (v) {
                    if (!r) {
                        r = [];
                    }
                    r.push(v);
                }
                return r;
            }, null);
        } else {
            return sourceAdapter.call(this, source, param);
        }
    },
    evaluateCondition: function (source, templateEntry) {
        var conditionPath = templateEntry.conditionPath;
        var condition = templateEntry.condition;
        if (conditionPath && condition) {
            var conditionSource = this.moveSourceAlongPath(source, conditionPath);
            var conditionFn = this.conditions[condition];
            return conditionFn(conditionSource);
        }
        return true;
    },
    evaluateValue: function (value, input) {
        var valueType = (typeof value);
        if (valueType === 'function') {
            return value(input);
        } else if (valueType === 'object') {
            return this.run(input, value);
        } else {
            return value;
        }
    },
    run: function (source, template) {
        var that = this;
        var conditionSource = source;
        source = that.moveSourceAlongPath(source, template.dataKey);
        if (bbuobject.exists(source)) {
            var b = that.evaluateCondition(conditionSource, template);
            if (b) {
                if (template.content) {
                    var content = template.content;
                    var hasValue = false;
                    var keys = Object.keys(content);
                    var result = keys.reduce(function (r, key) {
                        var contentValue = template.content[key];
                        var value = that.evaluateValue(contentValue, source);
                        if (value !== null) {
                            that.setProperty(r, key, value);
                            hasValue = true;
                        }
                        return r;
                    }, {});
                    return hasValue ? result : null;
                } else if (template.constant) {
                    return template.constant;
                } else if (template.value) {
                    return that.evaluateValue(template.value, source);
                } else {
                    var type = template.type || 'identity';
                    var sourceAdapter = type && that.sourceAdapters[type];
                    if (sourceAdapter) {
                        var param = template.typeParam;
                        var value = that.value(source, sourceAdapter, param);
                        if (value && template.targetType === 'array') {
                            value = [value];
                        }
                        return value;
                    } else {
                        logger.error('Invalid or missing \'type\' in template entry', {
                            template: template
                        });
                        return null;
                    }
                }
            }
        }
        return null;
    }
};

module.exports = function (resourceDict) {
    var result = Object.create(enginePrototype);
    result.resourceDict = resourceDict;
    return result;
};
