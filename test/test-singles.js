"use strict";

var chai = require('chai');
var _ = require('lodash');
var bbm = require('blue-button-model');

var fhir = require('../lib/fhir');
var templates = require('../lib/templates');

var expect = chai.expect;
var validator = bbm.validator;

var testDescription = function (casesKey, type, typeSingle) {
    var cases = require('./fixtures/unit/' + casesKey);

    var caseFn = function (n) {
        return function () {
            var c = cases[n];
            var result = fhir.resourceToModelEntry(c.input.resource, type);
            expect(result).to.deep.equal(c.result);
            var r = validator.validate(result, typeSingle);
            if (!r) {
                console.log(JSON.stringify(validator.getLastError(), undefined, 2));
            }
            expect(r).to.equal(true);
        };
    };

    return function () {
        for (var i = 0; i < cases.length; ++i) {
            it('case ' + i, caseFn(i));
        }
    };
};

describe('allergyIntolerance resource unit', testDescription('allergyIntolerance', 'allergies', 'allergy'));
describe('condition resource unit', testDescription('condition', 'problems', 'problem'));
