"use strict";

var chai = require('chai');
var bbm = require('blue-button-model');

var resourceStore = require('../../lib/resourceStore');
var fhir = require('../../lib/fhir');
var medicationAdministration = require('../../lib/resource/medicationAdministration');
var cases = require('../fixtures/unit/medicationAdministration');

var expect = chai.expect;
var validator = bbm.validator;

describe('medicationAdministration resource unit', function () {
    var caseFn = function (n) {
        return function () {
            var c = cases[n];
            var store = resourceStore.create();
            store.addResources(c.resources);

            var result = fhir.resourceToModel(store, medicationAdministration, c.input.body);
            expect(result).to.deep.equal(c.result);
            var r = validator.validate(result, 'medication');
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
