"use strict";

var bbu = require("blue-button-util");

var value = require('./value');

var jp = bbu.jsonpath.instance;

var problem = {
    content: {
        code: {
            value: value.concept,
            dataKey: jp('code.coding[0]')
        },
        'date_time.low': {
            value: value.date,
            dataKey: 'onsetDateTime'
        },
        'date_time.high': {
            value: value.date,
            dataKey: 'abatementDate'
        }
    }
};

exports.template = {
    type: 'problem',
    content: {
        problem: problem,
        'status.name': {
            value: value.whenInput('Resolved'),
            dataKey: 'abatementBoolean'
        }
    }
};
