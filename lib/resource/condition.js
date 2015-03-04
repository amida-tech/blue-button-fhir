"use strict";

var problem = {
    content: {
        code: {
            dataKey: 'code.coding.0',
            type: 'concept'
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
