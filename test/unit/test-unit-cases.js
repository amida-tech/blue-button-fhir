"use strict";

var chai = require('chai');
var bbm = require('blue-button-model');

var fhir = require('../../lib/fhir');

var aiCases = require('../fixtures/unit/allergyIntolerance');
var cCases = require('../fixtures/unit/condition');
var maCases = require('../fixtures/unit/medicationAdministration');
var mpCases = require('../fixtures/unit/medicationPrescription');
var orsCases = require('../fixtures/unit/observation-result-single');
var orCases = require('../fixtures/unit/observation-result');
var ovCases = require('../fixtures/unit/observation-vital');

var expect = chai.expect;
var validator = bbm.validator;

var testDescription = function (cases) {
    var caseFn = function (n) {
        return function () {
            var c = cases[n];
            var resourceDictionary = fhir.toResourceDictionary(c.resources);
            var result = fhir.resourceToModel(resourceDictionary, cases.template, c.input.content);
            expect(result).to.deep.equal(c.result);
            var r = validator.validate(result, cases.type);
            if (!r) {
                console.log(JSON.stringify(validator.getLastError(), undefined, 2));
            }
            expect(r).to.be.true;
        };
    };

    return function () {
        for (var i = 0; i < cases.length; ++i) {
            it('case ' + i, caseFn(i));
        }
    };
};

describe('allergyIntolerance resource unit', testDescription(aiCases));
describe('condition resource unit', testDescription(cCases));
describe('medicationAdministration resource unit', testDescription(maCases));
describe('medicationPrescription resource unit', testDescription(mpCases));
describe('observation-result-single resource unit', testDescription(orsCases));
describe('observation-result resource unit', testDescription(orCases));
describe('observation-vital resource unit', testDescription(ovCases));
