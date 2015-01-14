"use strict";

var fhir = require('./lib/fhir');

exports.toModel = function (resources) {
    return fhir.toModel(resources);
};
