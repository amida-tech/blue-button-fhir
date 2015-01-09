"use strict";

var bbu = require('blue-button-util');

var valueSets = require('./valueSets');

var bbudatetime = bbu.datetime;
var bbuobject = bbu.object;

var systemMap = {
    "http://www.nlm.nih.gov/research/umls/rxnorm": "RXNORM",
    "http://snomed.info/sct": "SNOMED CT",
    "http://loinc.org": "LOINC"
};

var transformMap = {
    codeToValueSet: function (app, obj, param) {
        if (typeof obj !== 'string') {
            app.log.error({
                invalidCode: obj
            });
            return null;
        }
        var valueSet = valueSets[param];
        if (!valueSet) {
            app.log.error({
                unknownValueSet: param
            });
            return null;
        }
        var result = valueSet[obj];
        if (!result) {
            app.log.error({
                code: obj,
                valueSet: param
            });
            return null;
        }
        return result;
    },
    concept: function (app, obj, param) {
        return {
            name: obj.display,
            code: obj.code,
            code_system_name: systemMap[obj.system]
        };
    },
    datetime: function (app, obj) {
        return bbudatetime.dateToModel(obj);
    }
};

var transformObj = function (app, obj, type, param) {
    var fn = transformMap[type];
    if (fn) {
        return fn(app, obj, param);
    } else {
        return app.log.error({
            invalidType: type
        });
    }
};

var setObjProperty = function (app, result, property, childResult) {
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
                app.log.warn({
                    existingObjectProperty: propertyPiece
                });
                obj[propertyPiece] = nextObj = {};
            }
        }
        obj = nextObj;
    }
    obj[propertyPieces[lastIndex]] = childResult;
};

var getChildObj = function (app, path, obj) {
    if (obj && path) {
        var pathPieces = path.split('.');
        var n = pathPieces.length;
        for (var i = 0; i < n; ++i) {
            var pathPiece = pathPieces[i];
            obj = obj[pathPiece];
            app.log.debug({
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
                obj = app.store.getReference(obj);
                if (!bbuobject.exists(obj)) {
                    app.log.debug({
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

var getChildResult = function (app, childObj, tentry, ttype) {
    if (typeof ttype === 'string') {
        return transformObj(app, childObj, ttype, tentry.typeParam);
    } else {
        return engine(app, ttype, childObj);
    }
};

engine = function engine(app, template, obj) {
    var result;
    template.forEach(function (tentry) {
        var ttype = tentry.type;
        if (ttype) {
            var childObj = getChildObj(app, tentry.path, obj);
            if (childObj) {
                var childResult;
                if (Array.isArray(childObj)) {
                    childResult = [];
                    childObj.forEach(function (element) {
                        var subChildResult = getChildResult(app, element, tentry, ttype);
                        if (subChildResult) {
                            childResult.push(subChildResult);
                        }
                    });
                    if (childResult.length < 1) {
                        childResult = null;
                    }
                } else {
                    childResult = getChildResult(app, childObj, tentry, ttype);
                }
                if (bbuobject.exists(childResult)) {
                    if (tentry.property) {
                        if (!bbuobject.exists(result)) {
                            result = {};
                        }
                        setObjProperty(app, result, tentry.property, childResult);
                    } else {
                        result = childResult;
                    }
                }
            }
        } else {
            app.log.error({
                templateEntry: tentry,
                msg: 'no type'
            });
        }
    });
    return result;
};

module.exports = engine;
