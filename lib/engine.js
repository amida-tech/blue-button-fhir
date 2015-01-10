"use strict";

var bbu = require('blue-button-util');

var valueSets = require('./valueSets');
var rootLogger = require('./logger');

var bbudatetime = bbu.datetime;
var bbuobject = bbu.object;

var logger = rootLogger.child({
    module: 'engine'
});

var systemMap = {
    "http://www.nlm.nih.gov/research/umls/rxnorm": "RXNORM",
    "http://snomed.info/sct": "SNOMED CT",
    "http://loinc.org": "LOINC"
};

var transformMap = {
    codeToValueSet: function (resourceDict, obj, param) {
        if (typeof obj !== 'string') {
            logger.error({
                invalidCode: obj
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
        var result = valueSet[obj];
        if (!result) {
            logger.error({
                code: obj,
                valueSet: param
            });
            return null;
        }
        return result;
    },
    concept: function (resourceDict, obj, param) {
        return {
            name: obj.display,
            code: obj.code,
            code_system_name: systemMap[obj.system]
        };
    },
    datetime: function (resourceDict, obj) {
        return bbudatetime.dateToModel(obj);
    },
    boolToConstant: function (resourceDict, obj, param) {
        var index = obj ? 0 : 1;
        return param[index];
    }
};

var transformObj = function (resourceDict, obj, type, param) {
    var fn = transformMap[type];
    if (fn) {
        return fn(resourceDict, obj, param);
    } else {
        return logger.error({
            invalidType: type
        });
    }
};

var setObjProperty = function (resourceDict, result, property, childResult) {
    var propertyPieces = property.split('.');
    var obj = result;
    var lastIndex = propertyPieces.length - 1;
    for (var i = 0; i < lastIndex; ++i) {
        var propertyPiece = propertyPieces[i];
        var nextObj = obj[propertyPiece];
        if (!bbuobject.exists(nextObj)) {
            obj[propertyPiece] = nextObj = {};
        } else {
            if ((typeof nextObj !== 'object') || Array.isArray(nextObj)) {
                logger.warn({
                    existingObjectProperty: propertyPiece
                });
                obj[propertyPiece] = nextObj = {};
            }
        }
        obj = nextObj;
    }
    obj[propertyPieces[lastIndex]] = childResult;
};

var getChildObj = function (resourceDict, path, obj) {
    if (obj && path) {
        var pathPieces = path.split('.');
        var n = pathPieces.length;
        for (var i = 0; i < n; ++i) {
            var pathPiece = pathPieces[i];
            obj = obj[pathPiece];
            logger.debug({
                gcoPath: path
            }, {
                gcpPathPiece: pathPiece
            }, {
                gco: obj
            });
            if (!bbuobject.exists(obj)) {
                break;
            } else if (pathPiece === 'reference') {
                var id = obj;
                obj = resourceDict[obj];
                if (!bbuobject.exists(obj)) {
                    logger.debug({
                        missingResource: id
                    });
                    break;
                }
            }
        }
    }
    return obj;
};

var engine;

var getChildResult = function (resourceDict, childObj, tentry, ttype) {
    if (typeof ttype === 'string') {
        return transformObj(resourceDict, childObj, ttype, tentry.typeParam);
    } else {
        return engine(resourceDict, ttype, childObj);
    }
};

engine = function engine(resourceDict, template, obj) {
    var result;
    template.forEach(function (tentry) {
        var ttype = tentry.type;
        if (ttype) {
            var childObj = getChildObj(resourceDict, tentry.path, obj);
            if (childObj) {
                var childResult;
                if (Array.isArray(childObj)) {
                    childResult = [];
                    childObj.forEach(function (element) {
                        var subChildResult = getChildResult(resourceDict, element, tentry, ttype);
                        if (subChildResult) {
                            childResult.push(subChildResult);
                        }
                    });
                    if (childResult.length < 1) {
                        childResult = null;
                    }
                } else {
                    childResult = getChildResult(resourceDict, childObj, tentry, ttype);
                }
                if (bbuobject.exists(childResult)) {
                    if (tentry.property) {
                        if (!bbuobject.exists(result)) {
                            result = {};
                        }
                        setObjProperty(resourceDict, result, tentry.property, childResult);
                    } else {
                        result = childResult;
                    }
                }
            }
        } else {
            logger.error({
                templateEntry: tentry,
                msg: 'no type'
            });
        }
    });
    return result;
};

module.exports = engine;
