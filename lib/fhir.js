"use strict";

var engine = require('./engine');
var rootLogger = require('./logger');
var resourceStore = require('./resourceStore');

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

var resourceToModel = exports.resourceToModel = function (store, resourceModel, resource) {
    var resourceDict = Object.create(store.index);
    var contained = resource.contained;
    if (contained) {
        contained.forEach(function (e) {
            var id = e.id;
            resourceDict['#' + id] = e;
        });
    }
    var runner = engine(resourceDict);
    var result = runner.run(resource, resourceModel.template);
    return result;
};

var entryResources = exports.entryResources = (function () {
    var pullRelatedOutOfContention = function (body, r, indexDictionary, doNotAddDictionary) {
        body.related.forEach(function (component) {
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
        Observation: function (resource, r, indexDictionary, doNotAddDictionary, options) {
            var body = resource.body;
            var isVital = body && body.extension && body.extension[0].valueCoding && (body.extension[0].valueCoding.code === '8716-3');
            if (isVital) {
                if (body.related) {
                    if (options.vitalsInPanel) {
                        pullRelatedOutOfContention(body, r, indexDictionary, doNotAddDictionary);
                        return 'observation_vital_panel';
                    } else {
                        return null;
                    }
                } else {
                    return 'observation_vital';
                }
            }
            var isResult = body && body.extension && body.extension[0].valueCoding && (body.extension[0].valueCoding.code === '11502-2');
            if (isResult) {
                if (body.related) {
                    pullRelatedOutOfContention(body, r, indexDictionary, doNotAddDictionary);
                    return 'observation_result';
                } else {
                    return 'observation_result_single';
                }
            }
        },
        MedicationPrescription: function () {
            return 'medicationPrescription';
        },
        MedicationAdministration: function (resource, r, indexDictionary, doNotAddDictionary) {
            var id = resource.body.prescription.reference;
            doNotAddDictionary[id] = true;
            var existingIndex = indexDictionary[id];
            if ((existingIndex !== undefined) && (existingIndex !== null)) {
                r[existingIndex] = null;
            }
            return 'medicationAdministration';
        }
    };

    return function (resources, options) {
        options = options || {};
        var indexDictionary = {};
        var doNotAddDictionary = {};
        var preliminaryResult = resources.reduce(function (r, resource) {
            var type = resource.type;
            var fn = resourceToHandlerKey[type];
            if (fn) {
                var id = type + '/' + resource.id;
                if (!doNotAddDictionary[id]) {
                    var hk = fn(resource, r, indexDictionary, doNotAddDictionary, options);
                    if (hk) {
                        r.push({
                            resource: resource,
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

    return function (input) {
        var resources = input;
        if (input.resourceType === 'Bundle') {
            var bundle = input;
            resources = [];
            var entries = bundle && bundle.entry;
            entries.forEach(function (entry) {
                var pieces = entry.id.split('/');
                var resource = {
                    type: pieces[0],
                    id: pieces[1],
                    body: entry.content
                };
                resources.push(resource);
            });
        }

        logger.trace('started toModel');

        var store = resourceStore.create(resources);

        var fn = function (entryResource) {
            var handlerKey = entryResource.handlerKey;
            var modeller = modellers[handlerKey];
            var value = resourceToModel(store, modeller, entryResource.resource.body);
            return {
                type: modeller.type,
                value: value
            };
        };

        var ers = entryResources(resources);
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
