"use strict";

var chai = require('chai');
var bbm = require('blue-button-model');

var resourceStore = require('../../lib/resourceStore');
var fhir = require('../../lib/fhir');
var allergyIntolerance = require('../../lib/resource/observation-vital');
var cases = require('../fixtures/unit/observation-vital');

var expect = chai.expect;
var validator = bbm.validator;

describe('observation-vital resource unit', function () {
    var caseFn = function (n) {
        return function () {
            var c = cases[n];
            var store = resourceStore.create();
            store.addResources(c.resources);

            var result = fhir.resourceToModel(store, allergyIntolerance, c.input.body);
            expect(result).to.deep.equal(c.result);
            var r = validator.validate(result, 'vital');
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
