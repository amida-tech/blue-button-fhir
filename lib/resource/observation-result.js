"use strict";

var value = require('./value');

var referenceRange = {
    content: {
        low: {
            dataKey: 'low.value',
            type: 'toString'
        },
        high: {
            dataKey: 'high.value',
            type: 'toString'
        },
        unit: {
            dataKey: 'low.units'
        },
        range: {
            dataKey: 'text'
        }
    }
};

var result = exports.result = {
    content: {
        result: {
            value: value.concept,
            dataKey: 'name.coding.0'
        },
        value: {
            dataKey: 'valueQuantity.value'
        },
        unit: {
            dataKey: 'valueQuantity.units'
        },
        interpretations: {
            dataKey: 'interpretation.coding.display',
        },
        reference_range: {
            dataKey: 'referenceRange.0',
            type: 'template',
            typeParam: referenceRange
        },
        'date_time.point': {
            dataKey: 'issued',
            type: 'date'
        },
        status: {
            dataKey: 'status',
            type: 'codeToValueSet',
            typeParam: 'observationStatus'
        },
        text: {
            dataKey: 'valueString'
        }
    }
};

exports.template = {
    content: {
        result_set: {
            value: value.concept,
            dataKey: 'name.coding.0'
        },
        results: {
            dataKey: 'related.target.reference',
            type: 'template',
            typeParam: result
        }
    }
};

exports.type = 'result';
