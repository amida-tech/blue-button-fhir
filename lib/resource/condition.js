"use strict";

var problem = {
    content: {
        code: {
            path: 'code.coding.0',
            type: 'concept'
        },
        'date_time.low': {
            path: 'onsetDate',
            type: 'date'
        },
        'date_time.high': {
            path: 'abatementDate',
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
            path: 'abatementBoolean',
            type: 'boolToConstant',
            typeParam: ['Resolved', null]
        }
    }
};

exports.type = 'problem';
