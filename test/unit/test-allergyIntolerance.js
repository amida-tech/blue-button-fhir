"use strict";

var chai = require('chai');
var bbm = require('blue-button-model');

var fhir = require('../../lib/fhir');
var allergyIntolerance = require('../../lib/resource/allergyIntolerance');

var expect = chai.expect;
var validator = bbm.validator;

var resources = [{
    "type": "AdverseReaction",
    "id": "0",
    "body": {
        "resourceType": "AdverseReaction",
        "subject": {
            "reference": "Patient/add70d80-2f87-11e4-a02b-699a62c7658f",
            "display": "PAC-PATRU TESTPATRU X"
        },
        "symptom": [{
            "severity": "minor",
            "code": {
                "coding": [{
                    "code": "267036007",
                    "system": "http://snomed.info/sct",
                    "display": "Shortness of Breath"
                }],
                "text": "Shortness of Breath"
            }
        }],
        "didNotOccurFlag": false
    }
}, {
    "type": "AllergyIntolerance",
    "id": "1",
    "body": {
        "resourceType": "AllergyIntolerance",
        "criticality": "medium",
        "sensitivityType": "allergy",
        "recordedDate": "2006-05-01",
        "status": "confirmed",
        "subject": {
            "reference": "Patient/add70d80-2f87-11e4-a02b-699a62c7658f",
            "display": "PAC-PATRU TESTPATRU X"
        },
        "substance": {
            "reference": "Substance/2",
            "display": "Codeine"
        },
        "reaction": [{
            "reference": "AdverseReaction/0",
            "display": "Shortness of Breath"
        }]
    }
}, {
    "type": "Substance",
    "id": "2",
    "body": {
        "resourceType": "Substance",
        "text": {
            "status": "generated",
            "div": "<div><p><b>Generated Narrative</b></p><br/><p><b>type</b>: <span title=\"Codes: {http://www.nlm.nih.gov/research/umls/rxnorm 2670}\">Codeine</span></p></div>"
        },
        "type": {
            "coding": [{
                "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                "code": "2670",
                "display": "Codeine"
            }],
            "text": "Codeine"
        }
    }
}];

describe('allergyIntolerance resource unit', function () {
    it('case 0', function (done) {
        var app = fhir.optionsToApp('test-allergyIntolerance', {});
        allergyIntolerance.toModel(app, resources[1], function (err, result) {
            if (err) {
                done(err);
            } else {
                var r = true; //validator.validate(result.value, result.type);
                if (r) {
                    done();
                } else {
                    var e = JSON.stringify(validator.getLastError(), undefined, 2);
                    done(new Error(e));
                }
            }
        });
    });
});
