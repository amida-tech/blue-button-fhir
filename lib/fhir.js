"use strict";

var async = require('async');

var engine = require('./engine');
var rootLogger = require('./logger');
var resourceStore = require('./resourceStore');

var condition = require('./resource/condition');
var allergyIntolerance = require('./resource/allergyIntolerance');

var logger = rootLogger.child({
    module: 'fhir'
});

var resourceToModel = exports.resourceToModel = function (store, template, resource) {
    var resourceDict = Object.create(store.index);
    var contained = resource.contained;
    if (contained) {
        contained.forEach(function (e) {
            var id = e.id;
            resourceDict['#' + id] = e;
        });
    }
    var result = engine(resourceDict, template, resource);
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
        'Condition': [condition, 'problems'],
        'AllergyIntolerance': [allergyIntolerance, 'allergy'],
        'AdverseReaction': [nopModeller, null],
        'Substance': [nopModeller, null]
    };

    return function (resources, options) {
        var store = resourceStore.create();

        logger.trace('started toModel');
        store.addResources(resources);

        var fn = function (resource) {
            var type = resource.type;
            var templateInfo = resourceToModeller[type];
            if (templateInfo) {
                var value = resourceToModel(store, templateInfo[0], resource.body);
                return {
                    type: templateInfo[1],
                    value: value
                };
            } else {
                logger.warn({
                    unsupportedResource: type
                });
                return null;
            }
        };

        var results = resources.map(resources, fn);
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
    };
})();
