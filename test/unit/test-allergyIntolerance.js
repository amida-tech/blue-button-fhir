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
        var c = cases[0];
        app.store.addResources(c.resources);

        allergyIntolerance.toModel(app, c.input, function (err, result) {
            if (err) {
                done(err);
            } else {
                expect(result.value).to.deep.equal(c.result);

                var r = validator.validate(result.value, result.type);
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
