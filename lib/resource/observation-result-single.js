"use strict";

var value = require('./value');
var observation_result = require('./observation-result');

var result = observation_result.result;

exports.template = {
    content: {
        result_set: {
            value: value.concept,
            dataKey: 'name.coding.0'
        },
        results: {
            type: 'template',
            typeParam: result,
            targetType: 'array'
        }
    }
};

exports.type = 'result';
