"use strict";

var value = require('./value');
var observation_result = require('./observation-result');

var result = observation_result.result;

exports.template = {
  type: 'result',
  content: {
    result_set: {
      value: value.concept,
      dataKey: 'code.coding[0]'
    },
    results: {
      template: result,
      multiple: true
    }
  }
};
