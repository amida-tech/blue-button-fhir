"use strict";

var value = require('./value');
var observation_result = require('./observation-result');

var result = observation_result.result;

exports.template = {
    type: 'result',
    content: {
        result_set: {
            value: value.concept,
            dataKey: 'name.coding.0'
        },
        results: {
            value: result,
            multiple: true
        }
    }
};
