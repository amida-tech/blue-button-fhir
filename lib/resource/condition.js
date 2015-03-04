"use strict";

var value = require('./value');

var problem = {
    content: {
        code: {
            value: value.concept,
            dataKey: 'code.coding.0'
        },
        'date_time.low': {
            dataKey: 'onsetDate',
            type: 'date'
        },
        'date_time.high': {
            dataKey: 'abatementDate',
            type: 'date'
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
