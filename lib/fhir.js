"use strict";

var engine = require('./engine');
var rootLogger = require('./logger');

var condition = require('./resource/condition');
var allergyIntolerance = require('./resource/allergyIntolerance');
var observation_vital = require('./resource/observation-vital');
var observation_result = require('./resource/observation-result');
var observation_result_single = require('./resource/observation-result-single');
var medicationAdministration = require('./resource/medicationAdministration');
var medicationPrescription = require('./resource/medicationPrescription');

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

var resourceToModel = exports.resourceToModel = function (resourceDictionary, resourceModel, resource) {
    var localResourceDictionary = Object.create(resourceDictionary);
    var contained = resource.contained;
    if (contained) {
        contained.forEach(function (e) {
            var id = e.id;
            localResourceDictionary['#' + id] = e;
        });
    }
    var runner = engine(localResourceDictionary);
    var result = runner.run(resource, resourceModel.template);
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
            var isVital = content && content.extension && content.extension[0].valueCoding && (content.extension[0].valueCoding.code === '8716-3');
            if (isVital) {
                if (content.related) {
                    return null;
                } else {
                    return 'observation_vital';
                }
            }
            var isResult = content && content.extension && content.extension[0].valueCoding && (content.extension[0].valueCoding.code === '11502-2');
            if (isResult) {
                if (content.related) {
                    pullRelatedOutOfContention(content, r, indexDictionary, doNotAddDictionary);
                    return 'observation_result';
                } else {
                    return 'observation_result_single';
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
                            handlerKey: hk
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
        medication: addToSection('medications')
    };

    var modellers = {
        condition: condition,
        allergyIntolerance: allergyIntolerance,
        observation_vital: observation_vital,
        observation_result: observation_result,
        observation_result_single: observation_result_single,
        medicationAdministration: medicationAdministration,
        medicationPrescription: medicationPrescription
    };

    return function (bundle) {
        logger.trace('started toModel');

        var bundleEntries = bundle && bundle.entry;
        var resourceDictionary = toResourceDictionary(bundleEntries);

        var fn = function (topBundleEntryInfo) {
            var handlerKey = topBundleEntryInfo.handlerKey;
            var modeller = modellers[handlerKey];
            var value = resourceToModel(resourceDictionary, modeller, topBundleEntryInfo.bundleEntry.content);
            return {
                type: modeller.type,
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
