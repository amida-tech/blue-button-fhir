"use strict";

var observation_result = require('./observation-result');

var result = observation_result.result;

exports.template = [{
    property: 'result_set',
    path: 'name.coding.0',
    type: 'concept'
}, {
    property: 'results',
    type: 'template',
    typeParam: result,
    targetType: 'array'
}];

exports.type = 'result';