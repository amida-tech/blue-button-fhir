"use strict";

var bbu = require('blue-button-util');

var valueSets = require('./valueSets');
var rootLogger = require('./logger');

var bbudatetime = bbu.datetime;
var bbuobject = bbu.object;

var logger = rootLogger.child({
    module: 'engine'
});

var enginePrototype = {
    systemMap: {
        "http://www.nlm.nih.gov/research/umls/rxnorm": "RXNORM",
        "http://snomed.info/sct": "SNOMED CT",
        "http://loinc.org": "LOINC"
    },
    transformMap: {
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
            return {
                name: source.display,
                code: source.code,
                code_system_name: this.systemMap[source.system]
            };
        },
        datetime: function (source) {
            return bbudatetime.dateToModel(source);
        },
        boolToConstant: function (source, param) {
            var index = source ? 0 : 1;
            return param[index];
        }
    },
    transformObj: function (source, type, param) {
        var fn = this.transformMap[type];
        if (fn) {
            return fn.call(this, source, param);
        } else {
            return logger.error({
                invalidType: type
            });
        }
    },
    setObjProperty: function (result, property, childResult) {
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
        source[propertyPieces[lastIndex]] = childResult;
    },
    moveSourceAlongPath: function (source, path) {
        if (source && path) {
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
    getChildResult: function (entrySource, templateEntry, templateEntryType) {
        if (typeof templateEntryType === 'string') {
            return this.transformObj(entrySource, templateEntryType, templateEntry.typeParam);
        } else {
            return this.run(entrySource, templateEntryType);
        }
    },
    run: function (source, template) {
        var result;
        template.forEach(function (templateEntry) {
            var entrySource = this.moveSourceAlongPath(source, templateEntry.path);
            if (entrySource) {
                var templateEntryType = templateEntry.type;
                if (templateEntryType) {
                    var childResult;
                    if (Array.isArray(entrySource)) {
                        childResult = [];
                        entrySource.forEach(function (element) {
                            var subChildResult = this.getChildResult(element, templateEntry, templateEntryType);
                            if (subChildResult) {
                                childResult.push(subChildResult);
                            }
                        }, this);
                        if (childResult.length < 1) {
                            childResult = null;
                        }
                    } else {
                        childResult = this.getChildResult(entrySource, templateEntry, templateEntryType);
                    }
                    if (bbuobject.exists(childResult)) {
                        if (templateEntry.property) {
                            if (!bbuobject.exists(result)) {
                                result = {};
                            }
                            this.setObjProperty(result, templateEntry.property, childResult);
                        } else {
                            result = childResult;
                        }
                    }
                } else {
                    logger.error({
                        templateEntry: templateEntry,
                        msg: 'no type'
                    });
                }
            }
        }, this);
        return result;
    }
};

module.exports = function (resourceDict) {
    var result = Object.create(enginePrototype);
    result.resourceDict = resourceDict;
    return result;
};
