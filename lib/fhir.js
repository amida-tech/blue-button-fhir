"use strict";

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
            var resource = bundleEntry.content;
            var id = bundleEntry.id;
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
            var content = bundleEntry.content;
            var extensionCode = bbuobject.deepValue(content, 'extension.0.valueCoding.code');
            if (extensionCode === '8716-3') {
                if (content.related) {
                    return null;
                } else {
                    return 'observation-vital';
                }
            }
            if (extensionCode === '11502-2') {
                if (content.related) {
                    pullRelatedOutOfContention(content, r, indexDictionary, doNotAddDictionary);
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
            var id = bundleEntry.content.prescription.reference;
            doNotAddDictionary[id] = true;
            var existingIndex = indexDictionary[id];
            if ((existingIndex !== undefined) && (existingIndex !== null)) {
                r[existingIndex] = null;
            }
            return 'medicationAdministration';
        },
        Patient: function () {
            return 'patient';
        }
    };

    return function (bundleEntries) {
        var indexDictionary = {};
        var doNotAddDictionary = {};
        var preliminaryResult = bundleEntries.reduce(function (r, bundleEntry) {
            var type = bundleEntry.content.resourceType;
            var fn = resourceToHandlerKey[type];
            if (fn) {
                var id = bundleEntry.id;
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

    var backwardCompatibility = function (bundle) {
        if (Array.isArray(bundle)) {
            var resources = bundle;
            bundle = {
                resourceType: 'Bundle',
                entry: []
            };
            resources.forEach(function (resource) {
                var bundleEntry = {
                    id: resource.type + '/' + resource.id,
                    content: resource.body
                };
                bundle.entry.push(bundleEntry);
            });
            return bundle;
        } else {
            return bundle;
        }
    };

    return function (bundle) {
        logger.trace('started toModel');
        bundle = backwardCompatibility(bundle); // remove in 1.5

        var bundleEntries = bundle && bundle.entry;
        var resourceDictionary = toResourceDictionary(bundleEntries);

        var fn = function (topBundleEntryInfo) {
            var templateKey = topBundleEntryInfo.templateKey;
            var template = templates[templateKey];
            var value = resourceToModel(resourceDictionary, template, topBundleEntryInfo.bundleEntry.content);
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
