"use strict";

var bbu = require('blue-button-util');

var datetime = bbu.datetime;

var systemMap = {
    "http://www.nlm.nih.gov/research/umls/rxnorm": "RxNorm",
    "http://snomed.info/sct": "SNOMED CT",
    "http://loinc.org": "LOINC"
};

exports.toModel = function (resource, server, callback) {
    callback(null, {
        type: 'allergy',
        value: null
    });
};
