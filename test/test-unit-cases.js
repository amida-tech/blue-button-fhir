"use strict";

var _ = require('lodash');
var bbm = require('@amida-tech/blue-button-model');

var fhir = require('../lib/fhir');
var templates = require('../lib/templates');

var validator = bbm.validator;

var testDescription = function (casesKey) {
  var cases = require('./fixtures/unit/' + casesKey);

  var caseFn = function (n) {
    return function () {
      var c = cases[n];
      var resourceDictionary = fhir.toResourceDictionary(c.resources);
      var template = templates[casesKey];
      var result = fhir.resourceToModel(resourceDictionary, template, c.input.resource);

      // console.log('resourceDictionary', resourceDictionary);
      // console.log('template', template);
      // console.log('result', result);
      // console.log('c.result', c.result);

      expect(result).toEqual(c.result);
      var r = validator.validate(result, template.type);
      if (!r) {
        console.log(JSON.stringify(validator.getLastError(), undefined, 2));
      }
      expect(r).toBe(true);
    };
  };

  return function () {
    for (var i = 0; i < cases.length; ++i) {
      it('case ' + i, caseFn(i));
    }
  };
};

describe('allergyIntolerance resource unit', testDescription('allergyIntolerance'));
// describe('condition resource unit', testDescription('condition'));
// describe('medicationAdministration resource unit', testDescription('medicationAdministration'));
// describe('medicationPrescription resource unit', testDescription('medicationPrescription'));
// //describe('medicationStatement resource unit', testDescription('medicationStatement'));
// describe('observation-result-single resource unit', testDescription('observation-result-single'));
// describe('observation-result resource unit', testDescription('observation-result'));
// describe('observation-vital resource unit', testDescription('observation-vital'));
// describe('patient resource unit', testDescription('patient'));
