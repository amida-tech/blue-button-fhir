"use strict";

var value = require('./value');

var referenceRange = {
    content: {
        low: {
            value: value.string,
            dataKey: 'low.value'
        },
        high: {
            value: value.string,
            dataKey: 'high.value'
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
            value: referenceRange,
            dataKey: 'referenceRange.0'
        },
        'date_time.point': {
            value: value.date,
            dataKey: 'issued'
        },
        status: {
            value: value.codeToValueSet('observationStatus'),
            dataKey: 'status'
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
            value: result,
            dataKey: 'related.target.reference'
        }
    }
};

exports.type = 'result';
