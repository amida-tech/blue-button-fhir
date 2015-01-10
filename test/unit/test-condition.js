"use strict";

var chai = require('chai');
var bbm = require('blue-button-model');

var resourceStore = require('../../lib/resourceStore');
var fhir = require('../../lib/fhir');
var condition = require('../../lib/resource/condition');
var cases = require('../fixtures/unit/condition');

var expect = chai.expect;
var validator = bbm.validator;

describe('condition resource unit', function () {
    var caseFn = function (n) {
        return function () {
            var c = cases[n];
            var store = resourceStore.create();
            var result = fhir.resourceToModel(store, condition, c.input.body);
            expect(result).to.deep.equal(c.result);
            var r = validator.validate(result, 'problem');
            if (!r) {
                console.log(JSON.stringify(validator.getLastError(), undefined, 2));
            }
        };
    };

    for (var i = 0; i < cases.length; ++i) {
        it('case ' + i, caseFn(i));
    }
});
