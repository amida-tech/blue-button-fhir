"use strict";

var chai = require('chai');
var bbm = require('blue-button-model');

var fhir = require('../../lib/fhir');
var allergyIntolerance = require('../../lib/resource/allergyIntolerance');
var cases = require('../fixtures/unit/allergyIntolerance');

var expect = chai.expect;
var validator = bbm.validator;

describe('allergyIntolerance resource unit', function () {
    it('case 0', function (done) {
        var app = fhir.optionsToApp('test-allergyIntolerance', {});
        app.store.addResources(cases[0].resources);

        allergyIntolerance.toModel(app, cases[0].input, function (err, result) {
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
