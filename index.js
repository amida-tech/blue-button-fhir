"use strict";

var fhir = require('./lib/fhir');
var store = require('./lib/resourceStore');

/**
 * Translates an array of json fhir resources into blue-button json model.
 *
 * @param {Object[]} resources
 */
exports.toModel = fhir.toModel;

/**
 * Typically resources have links to other resources.  This finds top level
 * resources for blue-button model.
 *
 * @param {Object[]} resources
 */
exports.entryResources = fhir.entryResources;

/**
 * This returns a dictionary of resources from which you can get references.
 *
 * @param {Object[]} resources
 */
exports.dictionary = store.create;
