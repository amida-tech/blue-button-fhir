"use strict";

var interpretation = [{
    path: 'display'
}];

var referenceRange = [{
    property: 'low',
    path: 'low.value',
    type: 'toString'
}, {
    property: 'high',
    path: 'high.value',
    type: 'toString'
}, {
    property: 'unit',
    path: 'low.units'
}, {
    property: 'range',
    path: 'text'
}];

var result = exports.result = [{
    property: 'result',
    path: 'name.coding.0',
    type: 'concept'
}, {
    property: 'value',
    path: 'valueQuantity.value'
}, {
    property: 'unit',
    path: 'valueQuantity.units'
}, {
    property: 'interpretations',
    path: 'interpretation.coding',
    type: 'template',
    typeParam: interpretation
}, {
    property: 'reference_range',
    path: 'referenceRange.0',
    type: 'template',
    typeParam: referenceRange
}, {
    property: 'date_time.point',
    path: 'issued',
    type: 'date'
}, {
    property: 'status',
    path: 'status',
    type: 'codeToValueSet',
    typeParam: 'observationStatus'
}, {
    property: 'textResult',
    path: 'valueString'
}];

var resultReference = [{
    path: 'target.reference',
    type: 'template',
    typeParam: result
}];

exports.template = [{
    property: 'result_set',
    path: 'name.coding.0',
    type: 'concept'
}, {
    property: 'results',
    path: 'related',
    type: 'template',
    typeParam: resultReference
}];

exports.type = 'result';
