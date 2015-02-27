blue-button-fhir
================

FHIR to Blue Button Model Translator

[![NPM](https://nodei.co/npm/blue-button-fhir.png)](https://nodei.co/npm/blue-button-fhir/)

[![Build Status](https://travis-ci.org/amida-tech/blue-button-fhir.svg)](https://travis-ci.org/amida-tech/blue-button-fhir)
[![Coverage Status](https://coveralls.io/repos/amida-tech/blue-button-fhir/badge.png)](https://coveralls.io/r/amida-tech/blue-button-fhir)

This library translates [FHIR Resource Bundles](http://www.hl7.org/implement/standards/fhir/extras.html) to [blue button model](https://github.com/amida-tech/blue-button).

Currently the following resources are supported in Bundles
* Allergy Intolerance
 * Adverse Reaction and Substance resources that are externally referenced from any Allergy Intolerance resource are assumed to be in the Bundle.
* Condition
* Medication Administration
 * Medication and Medication Prescription resources that are externally referenced from any Medication Administration resource are assumed to be in the Bundle. 
* Medication Prescription
 * Medication resources that are externally referenced from any Medication Prescription resource are assumed to be in the Bundle. 
* Observation
 * Observation resources are assumed to have an `extension.valueCoding` field that defines the LOINC description of the type of the resource. Vitals (code - 8716-3) and Results (code - 11502-2) are supported.

## Usage

Require blue-button-fhir module
``` javascript
var bbfhir = require("blue-button-fhir");
```
and translate a FHIR Resource Bundle 
``` javascript
var model = bbfhir.toModel(input);
```
Only allergies, vitals, results, medications and problems sections of blue button data are filled. 
``` javascript
console.log(model.data.allergies);
console.log(model.data.vitals);
console.log(model.data.results);
console.log(model.data.medications);
console.log(model.data.problems);
```
## Configuration

The only configurable item in this project is logging which can be configured in `lib/logger.js`.  See [bunyan](https://github.com/trentm/node-bunyan) for onfiguration options.

## Testing

[Mocha](http://mochajs.org/) and [Grunt](http://gruntjs.com/) are used for testing this prohect.  Simply run `grunt` in the project directory to run all the tests.
