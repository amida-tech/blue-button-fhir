"use strict";

var observation_result = require('./observation-result');

var result = observation_result.result;

exports.template = {
    content: {
        result_set: {
            dataKey: 'name.coding.0',
            type: 'concept'
        },
        results: {
            type: 'template',
            typeParam: result,
            targetType: 'array'
        }
    }
};

exports.type = 'result';
