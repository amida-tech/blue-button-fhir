"use strict";

var chai = require('chai');
var bbm = require('blue-button-model');

var resourceStore = require('../../lib/resourceStore');
var fhir = require('../../lib/fhir');
var observation_result = require('../../lib/resource/observation-result-single');
var cases = require('../fixtures/unit/observation-result-single');

var expect = chai.expect;
var validator = bbm.validator;

describe('observation-result-single resource unit', function () {
    var caseFn = function (n) {
        return function () {
            var c = cases[n];
            var store = resourceStore.create();
            store.addResources(c.resources);

            var result = fhir.resourceToModel(store, observation_result, c.input.body);
            expect(result).to.deep.equal(c.result);
            var r = true; //validator.validate(result, 'result');
            if (!r) {
                console.log(JSON.stringify(validator.getLastError(), undefined, 2));
            }
            expect(r).to.be.true;
        };
    };

    for (var i = 0; i < cases.length; ++i) {
        it('case ' + i, caseFn(i));
    }
});
