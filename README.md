blue-button-fhir
================

FHIR to Blue Button Model Translator

[![NPM](https://nodei.co/npm/blue-button-fhir.png)](https://nodei.co/npm/blue-button-fhir/)

[![Build Status](https://travis-ci.org/amida-tech/blue-button-fhir.svg)](https://travis-ci.org/amida-tech/blue-button-fhir)
[![Coverage Status](https://coveralls.io/repos/amida-tech/blue-button-fhir/badge.png)](https://coveralls.io/r/amida-tech/blue-button-fhir)

This library translates an array of FHIR resources to [blue button model](https://github.com/amida-tech/blue-button).

Currently the following resources are supported
* Allergy Intolerance
* Condition
* Medication Administration
* Medication Prescription
* Observation (vitals - LOINC code 8716-3)
* Observation (results - LOINC code 11502-2)

It is assumed that any resources that are referenced from these resources also exist in the input array.  This library is synchronous and do not call to any FHIR server.

## Usage

Require blue-button-fhir module
``` javascript
var bbfhir = require("blue-button-fhir");
```
and translate an array of resources 
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
