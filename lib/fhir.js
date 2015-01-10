"use strict";

var async = require('async');

var rootLogger = require('./logger');
var resourceStore = require('./resourceStore');

var condition = require('./resource/condition');
var allergyIntolerance = require('./resource/allergyIntolerance');

var logger = rootLogger.child({
    module: 'fhir'
});

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
        'AdverseReaction': nopModeller,
        'Substance': nopModeller
    };

    return function (resources, options) {
        var store = resourceStore.create();

        logger.trace('started toModel');
        store.addResources(resources);

        var fn = function (resource) {
            var type = resource.type;
            var modeller = resourceToModeller[type];
            if (modeller) {
                return modeller.toModel(store, resource.body);
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
