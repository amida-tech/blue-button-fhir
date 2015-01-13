"use strict";

var engine = require('./engine');
var rootLogger = require('./logger');
var resourceStore = require('./resourceStore');

var condition = require('./resource/condition');
var allergyIntolerance = require('./resource/allergyIntolerance');
var observation_vital = require('./resource/observation-vital');

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

exports.toModel = (function () {
    var addToSection = function (sectionName) {
        return function (data, value) {
            var section = data[sectionName] || (data[sectionName] = []);
            section.push(value);
        };
    };

    var modelUpdate = {
        problem: addToSection('problems'),
        allergy: addToSection('allergies')
    };

    var nopModeller = {
        toModel: function (app, resource) {
            return null;
        }
    };

    var resourceToModeller = {
        'Condition': condition,
        'AllergyIntolerance': allergyIntolerance,
        'AdverseReaction': null,
        'Substance': null,
        'Observation': observation_vital
    };

    return function (resources) {
        var store = resourceStore.create();

        logger.trace('started toModel');
        store.addResources(resources);

        var fn = function (resource) {
            var type = resource.type;
            var modeller = resourceToModeller[type];
            if (modeller) {
                var value = resourceToModel(store, modeller, resource.body);
                return {
                    type: modeller.type,
                    value: value
                };
            } else {
                logger.warn({
                    unsupportedResource: type
                });
                return null;
            }
        };

        var results = resources.map(fn);
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
