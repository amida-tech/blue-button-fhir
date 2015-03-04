"use strict";

var value = require('./value');

var problem = {
    content: {
        code: {
            value: value.concept,
            dataKey: 'code.coding.0'
        },
        'date_time.low': {
            value: value.date,
            dataKey: 'onsetDate'
        },
        'date_time.high': {
            value: value.date,
            dataKey: 'abatementDate'
        }
    }
};

exports.template = {
    content: {
        problem: {
            type: 'template',
            typeParam: problem
        },
        'status.name': {
            dataKey: 'abatementBoolean',
            type: 'boolToConstant',
            typeParam: ['Resolved', null]
        }
    }
};

exports.type = 'problem';
