"use strict";

var _ = require('lodash');
var bbu = require('blue-button-util');

var json2Json = require('./json2Json');
var rootLogger = require('./logger');
var templates = require('./templates');

var bbuobject = bbu.object;

var logger = rootLogger.child({
    module: 'fhir'
});

var toResourceDictionary = exports.toResourceDictionary = function (bundleEntries) {
    var result = {};
    if (bundleEntries) {
        bundleEntries.forEach(function (bundleEntry) {
            var resource = bundleEntry.resource;
            var id = resource.id;
            result[id] = resource;
        });
    }
    return result;
};

var resourceToModel = exports.resourceToModel = function (resourceDictionary, template, resource) {
    var localResourceDictionary = Object.create(resourceDictionary);
    var contained = resource.contained;
    if (contained) {
        contained.forEach(function (e) {
            var id = e.id;
            localResourceDictionary['#' + id] = e;
        });
    }
    var j2j = json2Json.instance(localResourceDictionary);
    var result = j2j.run(template, resource);
    return result;
};

var classifyResource = exports.classifyResource = (function () {
    var codeMap = {
        '9279-1': "vitals",
        '8867-4': "vitals",
        '2710-2': "vitals",
        '55284-4': "vitals",
        '55418-8': "vitals",
        '8480-6': "vitals",
        '8462-4': "vitals",
        '8310-5': "vitals",
        '8302-2': "vitals",
        '8306-3': "vitals",
        '8287-5': "vitals",
        '3141-9': "vitals",
        '39156-5': "vitals",
        '3140-1': "vitals",
        '8716-3': "vitals",
        '8284-2': "vitals",
        '29463-7': "vitals",
        '35094-2': "vitals",
        '41909-3': 'vitals',
        '3139-2': 'vitals'
    };

    var typeMap = {
        observation: 'results',
        condition: 'problems',
        allergyintolerance: 'allergies'
    };

    return function (resource) {
        var code = bbuobject.deepValue(resource, 'code.coding.0.code');
        var type = codeMap[code];
        if (type) {
            return type;
        }
        type = typeMap[resource.resourceType.toLowerCase()];
        if (type) {
            return type;
        }
        return 'other';
    };
})();

var topBundleEntryInfos = exports.topBundleEntryInfos = (function () {
    var pullRelatedOutOfContention = function (content, r, indexDictionary, doNotAddDictionary) {
        content.related.forEach(function (component) {
            var id = component.target.reference;
            doNotAddDictionary[id] = true;
            var existingIndex = indexDictionary[id];
            if ((existingIndex !== undefined) && (existingIndex !== null)) {
                r[existingIndex] = null;
            }
        });
    };

    var resourceToHandlerKey = {
        Condition: function () {
            return 'condition';
        },
        AllergyIntolerance: function () {
            return 'allergyIntolerance';
        },
        Observation: function (bundleEntry, r, indexDictionary, doNotAddDictionary) {
            var resource = bundleEntry.resource;
            var observationType = classifyResource(resource);
            if (observationType === 'vitals') {
                if (resource.related) {
                    return null;
                } else {
                    return 'observation-vital';
                }
            } else {
                if (resource.related) {
                    pullRelatedOutOfContention(resource, r, indexDictionary, doNotAddDictionary);
                    return 'observation-result';
                } else {
                    return 'observation-result-single';
                }
            }
        },
        MedicationPrescription: function () {
            return 'medicationPrescription';
        },
        MedicationAdministration: function (bundleEntry, r, indexDictionary, doNotAddDictionary) {
            var id = bundleEntry.resource.prescription.reference;
            doNotAddDictionary[id] = true;
            var existingIndex = indexDictionary[id];
            if ((existingIndex !== undefined) && (existingIndex !== null)) {
                r[existingIndex] = null;
            }
            return 'medicationAdministration';
        },
        'MedicationStatement': function () {
            return 'medicationStatement';
        },
        Patient: function () {
            return 'patient';
        }
    };

    return function (bundleEntries) {
        var indexDictionary = {};
        var doNotAddDictionary = {};
        var preliminaryResult = bundleEntries.reduce(function (r, bundleEntry) {
            var resource = bundleEntry.resource;
            var type = resource.resourceType;
            var fn = resourceToHandlerKey[type];
            if (fn) {
                var id = resource.id;
                if (!doNotAddDictionary[id]) {
                    var hk = fn(bundleEntry, r, indexDictionary, doNotAddDictionary);
                    if (hk) {
                        r.push({
                            bundleEntry: bundleEntry,
                            templateKey: hk
                        });
                        indexDictionary[id] = r.length - 1;
                    }
                }
            }
            return r;
        }, []);
        var result = preliminaryResult.filter(function (e) {
            return e;
        });
        return result;
    };
})();

exports.toModel = (function () {
    var addToSection = function (sectionName) {
        return function (data, value) {
            var section = data[sectionName] || (data[sectionName] = []);
            section.push(value);
        };
    };

    var modelUpdate = {
        problem: addToSection('problems'),
        allergy: addToSection('allergies'),
        vital: addToSection('vitals'),
        result: addToSection('results'),
        medication: addToSection('medications'),
        demographics: function (data, value) {
            data.demographics = value;
        }
    };

    return function (bundle) {
        logger.trace('started toModel');

        var bundleEntries = bundle && bundle.entry;
        var resourceDictionary = toResourceDictionary(bundleEntries);

        var fn = function (topBundleEntryInfo) {
            var templateKey = topBundleEntryInfo.templateKey;
            var template = templates[templateKey];
            var value = resourceToModel(resourceDictionary, template, topBundleEntryInfo.bundleEntry.resource);
            return {
                type: template.type,
                value: value
            };
        };

        var ers = topBundleEntryInfos(bundleEntries);
        var results = ers.map(fn);
        var model = {
            meta: {},
            data: {}
        };
        results.forEach(function (result) {
            var type = result.type;
            var f = modelUpdate[type];
            if (f) {
                f(model.data, result.value);
            }
        });
        return model;
    };
})();

exports.resourceToModelEntry = (function () {
    var map = {
        'vitals': 'observation-vital',
        'problems': 'condition',
        'allergies': 'allergyIntolerance',
        'results': 'observation-result-single',
        'medications': 'medicationPrescription',
        'demographics': 'patient'
    };

    return function (resource, type) {
        var templateKey = map[type];
        var template = templates[templateKey];
        var j2j = json2Json.instance();
        var result = j2j.run(template, resource);
        return result;
    };
})();
