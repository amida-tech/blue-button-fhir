"use strict";

var chai = require('chai');
var bbm = require('blue-button-model');

var condition = require('../../lib/resource/condition');

var expect = chai.expect;
var validator = bbm.validator;

var input0 = {
    "type": "Condition",
    "id": "0",
    "body": {
        "resourceType": "Condition",
        "status": "confirmed",
        "subject": {
            "reference": "Patient/1",
            "display": "DOE, JOE"
        },
        "onsetDate": "2012-08-05",
        "dateAsserted": "2012-08-05",
        "abatementBoolean": true,
        "code": {
            "coding": [{
                "code": "233604007",
                "system": "http://snomed.info/sct",
                "display": "Pneumonia"
            }],
            "text": "Pneumonia"
        }
    }
};

describe('condition resource unit', function () {
    it('case 0', function (done) {
        condition.toModel(input0.body, {}, function (err, problem) {
            if (err) {
                done(err);
            } else {
                var result = validator.validate(problem, 'problem');
                if (result) {
                    done();
                } else {
                    var e = JSON.stringify(validator.getLastError(), undefined, 2);
                    done(new Error(e));
                }
            }
        });
    });
});
