"use strict";

var bbu = require('blue-button-util');

var datetime = bbu.datetime;

var systemMap = {
    "http://www.nlm.nih.gov/research/umls/rxnorm": "RxNorm",
    "http://snomed.info/sct": "SNOMED CT",
    "http://loinc.org": "LOINC"
};

exports.toModel = function (resource, server, callback) {
    var problem = {};
    var resourceCode = resource && resource.code && resource.code.coding;
    if (resourceCode) {
        var code = {};
        var rsystem = resourceCode[0].system && systemMap[resourceCode[0].system];
        var rdisplay = resourceCode[0].display;
        var rcode = resourceCode[0].code;
        if (rsystem) {
            code.code_system_name = rsystem;
        }
        if (rcode) {
            code.code = rcode;
        }
        if (rdisplay) {
            code.name = rdisplay;
        }
        problem.code = code;
    }

    var problemDateTime = {};

    var onsetDate = resource.onsetDate;
    if (onsetDate) {
        var low = datetime.dateToModel(onsetDate);
        if (low) {
            problemDateTime.low = low;
        }
    }
    var abatementDate = resource.abatementDate;
    if (abatementDate) {
        var high = datetime.dateToModel(abatementDate);
        if (high) {
            problemDateTime.high = high;
        }
    }
    problem.date_time = problemDateTime;

    var result = {};
    if (problem) {
        result.problem = problem;
    }
    if (resource.abatementBoolean) {
        result.status = {
            name: "Resolved"
        };
    }

    callback(null, result);
};
