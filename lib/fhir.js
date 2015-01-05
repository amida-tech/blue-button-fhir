"use strict";

var async = require('async');

var resourceAccumulator = require('resourceAccumulator');

exports.toModel = (function () {
    return function (resources, options, callback) {
        var rs = resourceAccumulator(options);

        async.each(resources, rs.add, function (err) {
            if (err) {
                callback(err);
            }
        });

        var fn;
        async.eachSeries(resources, fn, function (err) {
            if (err) {
                callback(err);
            }
        });
    };
})();
