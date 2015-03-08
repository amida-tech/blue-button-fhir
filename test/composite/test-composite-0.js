"use strict";

var chai = require('chai');
var bbu = require('blue-button-util');

var fhir = require('../../index');

var cases_a = require('../fixtures/unit/allergyIntolerance');
var cases_c = require('../fixtures/unit/condition');
var cases_ma = require('../fixtures/unit/medicationAdministration');
var cases_mp = require('../fixtures/unit/medicationPrescription');
var cases_ors = require('../fixtures/unit/observation-result-single');
var cases_or = require('../fixtures/unit/observation-result');
var cases_ov = require('../fixtures/unit/observation-vital');

var expect = chai.expect;
var arrayset = bbu.arrayset;

describe('composite tests', function () {
    it('all resources', function () {
        var resources = [];
        var expected = {};

        var sections = [
            'allergies',
            'problems',
            'medications',
            'medications',
            'results',
            'results',
            'vitals'
        ];

        [cases_a, cases_c, cases_ma, cases_mp, cases_ors, cases_or, cases_ov].forEach(function (cmodule, index) {
            var sectionName = sections[index];
            cmodule.forEach(function (c) {
                arrayset.append(resources, c.resources);
                if (!expected[sectionName]) {
                    expected[sectionName] = [];
                }
                expected[sectionName].push(c.result);
            });
        });

        var bundle = {
            resourceType: 'Bundle',
            entry: resources
        };

        var actual = fhir.toModel(bundle);
        expect(actual.data).to.deep.equal(expected);

        var oldTypeResources = resources.map(function (resource) {
            var r = {
                type: resource.content.resourceType,
                id: resource.id.split('/')[1],
                body: resource.content
            };
            console.log(r);
            return r;
        });
        var actualBC = fhir.toModel(oldTypeResources);
        expect(actualBC.data).to.deep.equal(expected);
    });
});
