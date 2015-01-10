"use strict";

var async = require('async');

var log = require('./log');
var resourceStore = require('./resourceStore');

var condition = require('./resource/condition');
var allergyIntolerance = require('./resource/allergyIntolerance');

var optionsToApp = exports.optionsToApp = function (entry, options) {
    var appLog = options.log || log.child(entry);
    return {
        log: appLog,
        store: resourceStore.create(appLog)
    };
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
        toModel: function (app, resource, callback) {
            callback(null, null);
        }
    };

    var resourceToModeller = {
        'Condition': condition,
        'AllergyIntolerance': allergyIntolerance,
        'AdverseReaction': nopModeller,
        'Substance': nopModeller
    };

    return function (resources, options, callback) {
        var app = optionsToApp('toModel', options);

        app.log.trace('started toModel');
        app.store.addResources(resources);

        var fn = function (resource, callback) {
            var type = resource.type;
            var modeller = resourceToModeller[type];
            if (modeller) {
                modeller.toModel(app, resource, callback);
            } else {
                app.log.warn({
                    unsupportedResource: type
                });
                callback(null);
            }
        };

        async.map(resources, fn, function (err, results) {
            if (err) {
                callback(err);
            } else {
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
                callback(null, model);
            }
        });
    };
})();
