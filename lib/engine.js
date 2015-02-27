"use strict";

var bbu = require('blue-button-util');
var bbm = require('blue-button-meta');
var lodash = require('lodash');

var valueSets = require('./valueSets');
var rootLogger = require('./logger');

var bbudatetime = bbu.datetime;
var bbuobject = bbu.object;
var code_systems = bbm.code_systems;

var logger = rootLogger.child({
    module: 'engine'
});

var enginePrototype = {
    systemMap: {
        "http://www.nlm.nih.gov/research/umls/rxnorm": "RXNORM",
        "http://snomed.info/sct": "SNOMED CT",
        "http://loinc.org": "LOINC",
        "urn:oid:2.16.840.1.113883.3.26.1.1": "Medication Route FDA",
        "http://fdasis.nlm.nih.gov": "UNII"
    },
    sourceAdapters: {
        codeToValueSet: function (source, param) {
            if (typeof source !== 'string') {
                logger.error({
                    invalidCode: source
                });
                return null;
            }
            var valueSet = valueSets[param];
            if (!valueSet) {
                logger.error({
                    unknownValueSet: param
                });
                return null;
            }
            var result = valueSet[source];
            if (!result) {
                logger.error({
                    code: source,
                    valueSet: param
                });
                return null;
            }
            return result;
        },
        concept: function (source, param) {
            var result = {
                name: source.display,
                code: source.code
            };
            if (source.system) {
                var csm = this.systemMap[source.system];
                if ((!csm) && (source.system.substring(0, 8) === 'urn:oid')) {
                    var oid = source.system.substring(8);
                    var csobject = code_systems.find(oid);
                    if (csobject) {
                        csm = csobject.name();
                    }
                }
                if (csm) {
                    result.code_system_name = csm;
                } else {
                    logger.error('cannot find code system nane for %s', source.system);
                }
            }
            return result;
        },
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
        },
        constant: function (source, param) {
            return param;
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
    run: function (source, template) {
        var that = this;
        return template.reduce(function (result, templateEntry) {
            var entrySource = that.moveSourceAlongPath(source, templateEntry.path);
            if (bbuobject.exists(entrySource)) {
                var b = that.evaluateCondition(source, templateEntry);
                if (b) {
                    var type = templateEntry.type || 'identity';
                    var sourceAdapter = type && that.sourceAdapters[type];
                    if (sourceAdapter) {
                        var param = templateEntry.typeParam;
                        var value = that.value(entrySource, sourceAdapter, param);
                        if (bbuobject.exists(value)) {
                            var property = templateEntry.property;
                            if (property) {
                                if (!bbuobject.exists(result)) {
                                    result = {};
                                }
                                if (templateEntry.targetType === 'array') {
                                    value = [value];
                                }
                                that.setProperty(result, property, value);
                            } else {
                                if (bbuobject.exists(result)) {
                                    lodash.merge(result, value);
                                } else {
                                    result = value;
                                }
                            }
                        }
                    } else {
                        logger.error('Invalid or missing \'type\' in template entry', {
                            templateEntry: templateEntry
                        });
                    }
                }
            }
            return result;
        }, null);
    }
};

module.exports = function (resourceDict) {
    var result = Object.create(enginePrototype);
    result.resourceDict = resourceDict;
    return result;
};
