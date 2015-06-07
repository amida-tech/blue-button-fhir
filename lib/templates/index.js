"use strict";

module.exports = {
    'condition': require('./condition').template,
    'allergyIntolerance': require('./allergyIntolerance').template,
    'observation-vital': require('./observation-vital').template,
    'observation-result': require('./observation-result').template,
    'observation-result-single': require('./observation-result-single').template,
    'medicationAdministration': require('./medicationAdministration').template,
    'medicationPrescription': require('./medicationPrescription').template,
    'medicationStatement': require('./medicationStatement').template,
    'patient': require('./patient').template
};
