"use strict";

var chai = require('chai');
var bbm = require('blue-button-model');

var resourceStore = require('../../lib/resourceStore');
var fhir = require('../../lib/fhir');
var allergyIntolerance = require('../../lib/resource/allergyIntolerance');
var cases = require('../fixtures/unit/allergyIntolerance');

var expect = chai.expect;
var validator = bbm.validator;

describe('allergyIntolerance resource unit', function () {
    var caseFn = function (n) {
        return function () {
            var c = cases[n];
            var store = resourceStore.create();
            store.addResources(c.resources);

            var result = fhir.resourceToModel(store, allergyIntolerance, c.input.body);
            expect(result).to.deep.equal(c.result);
            var r = true; //validator.validate(result, 'allergy');
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
