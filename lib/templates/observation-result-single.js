"use strict";

var bbu = require("blue-button-util");

var value = require('./value');
var observation_result = require('./observation-result');

var result = observation_result.result;
var jp = bbu.jsonpath.instance;

exports.template = {
    type: 'result',
    content: {
        result_set: {
            value: value.concept,
            dataKey: jp('code.coding[0]')
        },
        results: {
            value: result,
            multiple: true
        }
    }
};
