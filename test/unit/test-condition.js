"use strict";

var chai = require('chai');
var bbm = require('blue-button-model');

var fhir = require('../../lib/fhir');
var condition = require('../../lib/resource/condition');
var cases = require('../fixtures/unit/condition');

var expect = chai.expect;
var validator = bbm.validator;

describe('condition resource unit', function () {
    var app = fhir.optionsToApp('test-condition', {});

    var caseFn = function (n) {
        return function (done) {
            var c = cases[n];
            condition.toModel(app, c.input, function (err, result) {
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
        };
    };

    for (var i = 0; i < cases.length; ++i) {
        it('case ' + i, caseFn(i));
    }
});
