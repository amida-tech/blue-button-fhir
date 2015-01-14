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

var resourceToModeller = {
    Condition: function () {
        return condition;
    },
    AllergyIntolerance: function () {
        return allergyIntolerance;
    },
    Observation: function (resource, r, indexDictionary, doNotAddDictionary) {
        var body = resource.body;
        var isVital = body && body.extension && body.extension[0].valueCoding && (body.extension[0].valueCoding.code === '8716-3');
        if (isVital) {
            return body.related ? null : observation_vital;
        }
        var isResult = body && body.extension && body.extension[0].valueCoding && (body.extension[0].valueCoding.code === '11502-2');
        if (isResult) {
            if (body.related) {
                body.related.forEach(function (component) {
                    var id = component.target.reference;
                    doNotAddDictionary[id] = true;
                    var existingIndex = indexDictionary[id];
                    if ((existingIndex !== undefined) && (existingIndex !== null)) {
                        r[existingIndex] = null;
                    }
                });
                return observation_result;
            } else {
                return observation_result_single;
            }
        }
    },
    MedicationPrescription: function () {
        return medicationPrescription;
    },
    MedicationAdministration: function (resource, r, indexDictionary, doNotAddDictionary) {
        var id = resource.body.prescription.reference;
        doNotAddDictionary[id] = true;
        var existingIndex = indexDictionary[id];
        if ((existingIndex !== undefined) && (existingIndex !== null)) {
            r[existingIndex] = null;
        }
        return medicationAdministration;
    }
};

var entryResources = function (resources) {
    var indexDictionary = {};
    var doNotAddDictionary = {};
    var preliminaryResult = resources.reduce(function (r, resource) {
        var type = resource.type;
        var fn = resourceToModeller[type];
        if (fn) {
            var id = type + '/' + resource.id;
            if (!doNotAddDictionary[id]) {
                var rm = fn(resource, r, indexDictionary, doNotAddDictionary);
                if (rm) {
                    r.push({
                        resource: resource,
                        modeller: rm
                    });
                    indexDictionary[id] = r.length - 1;
                }
            }
        }
        return r;
    }, []);
    return preliminaryResult;
};

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

    return function (resources) {
        var store = resourceStore.create();

        logger.trace('started toModel');
        store.addResources(resources);

        var fn = function (entryResource) {
            if (entryResource) {
                var modeller = entryResource.modeller;
                var value = resourceToModel(store, modeller, entryResource.resource.body);
                return {
                    type: modeller.type,
                    value: value
                };
            } else {
                return null;
            }
        };

        var ers = entryResources(resources);
        var results = ers.map(fn);
        var model = {
            meta: {},
            data: {}
        };
        results.forEach(function (result) {
            if (result) {
                var type = result.type;
                var f = modelUpdate[type];
                if (f) {
                    f(model.data, result.value);
                }
            }
        });
        return model;
    };
})();
