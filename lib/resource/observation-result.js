"use strict";

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
            dataKey: 'name.coding.0',
            type: 'concept'
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
            dataKey: 'name.coding.0',
            type: 'concept'
        },
        results: {
            dataKey: 'related.target.reference',
            type: 'template',
            typeParam: result
        }
    }
};

exports.type = 'result';
