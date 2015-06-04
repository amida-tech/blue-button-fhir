"use strict";

var bbm = require('blue-button-meta');
var bbu = require('blue-button-util');
var _ = require('lodash');

var valueSets = require('../valueSets');
var rootLogger = require('../logger');

var bbudatetime = bbu.datetime;
var code_systems = bbm.code_systems;

var logger = rootLogger.child({
    module: 'templates.value'
});

exports.date = bbudatetime.dateToModel;

exports.datetime = bbudatetime.dateTimeToModel;

exports.string = function (input) {
    return input.toString();
};

exports.concept = (function () {
    var systemMap = {
        "http://www.nlm.nih.gov/research/umls/rxnorm": "RXNORM",
        "http://snomed.info/sct": "SNOMED CT",
        "http://loinc.org": "LOINC",
        "urn:oid:2.16.840.1.113883.3.26.1.1": "Medication Route FDA",
        "http://fdasis.nlm.nih.gov": "UNII",
        "http://hl7.org/fhir/sid/icd-9": "ICD-9"
    };

    return function (input) {
        var result = {
            name: input.display,
            code: input.code
        };
        if (input.system) {
            var csm = systemMap[input.system];
            if ((!csm) && (input.system.substring(0, 8) === 'urn:oid:')) {
                var oid = input.system.substring(8);
                var csobject = code_systems.find(oid);
                if (csobject) {
                    csm = csobject.name();
                }
            }
            if (csm) {
                result.code_system_name = csm;
            } else {
                logger.error('cannot find code system name for %s', input.system);
            }
        }
        return result;
    };
})();

exports.conceptWithDefaultFromText = function (input) {
    var coding = _.get(input, 'coding[0]');
    if (coding) {
        return exports.concept(coding);
    } else if (input.text) {
        return {
            name: input.text
        };
    } else {
        return null;
    }
};

exports.codeToValueSet = function (valueSetName) {
    return function (input) {
        if (typeof input !== 'string') {
            logger.error({
                invalidCode: input
            });
            return null;
        }
        var valueSet = valueSets[valueSetName];
        if (!valueSet) {
            logger.error({
                unknownValueSet: valueSetName
            });
            return null;
        }
        var result = valueSet[input];
        if (!result) {
            logger.error({
                code: input,
                valueSet: valueSetName
            }, 'code not found');
            return null;
        }
        return result;
    };
};

exports.whenInput = function (value) {
    return function (input) {
        return input ? value : null;
    };
};
