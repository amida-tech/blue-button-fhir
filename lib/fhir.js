"use strict";

var async = require('async');

var resourceAccumulator = require('./resourceAccumulator');

var condition = require('./resource/condition');

exports.toModel = (function () {
    var addToSection = function (sectionName) {
        return function (data, value) {
            var section = data[sectionName] || (data[sectionName] = []);
            section.push(value);
        };
    };

    var modelUpdate = {
        problem: addToSection('problems')
    };

    var resourceToModeller = {
        'Condition': condition
    };

    return function (resources, options, callback) {
        //var rs = resourceAccumulator(options);

        //async.each(resources, rs.add, function (err) {
        //    if (err) {
        //        callback(err);
        //    }
        //});

        var fn = function (resource, callback) {
            var type = resource.type;
            var modeller = resourceToModeller[type];
            if (modeller) {
                modeller.toModel(resource, null, callback);
            } else {
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
