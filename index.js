"use strict";

var fhir = require('./lib/fhir');

exports.toModel = fhir.toModel;

exports.resourceToModelEntry = fhir.resourceToModelEntry;

exports.classifyResource = fhir.classifyResource;
