"use strict";

var referenceRange = {
    content: {
        low: {
            path: 'low.value',
            type: 'toString'
        },
        high: {
            path: 'high.value',
            type: 'toString'
        },
        unit: {
            path: 'low.units'
        },
        range: {
            path: 'text'
        }
    }
};

var result = exports.result = {
    content: {
        result: {
            path: 'name.coding.0',
            type: 'concept'
        },
        value: {
            path: 'valueQuantity.value'
        },
        unit: {
            path: 'valueQuantity.units'
        },
        interpretations: {
            path: 'interpretation.coding.display',
        },
        reference_range: {
            path: 'referenceRange.0',
            type: 'template',
            typeParam: referenceRange
        },
        'date_time.point': {
            path: 'issued',
            type: 'date'
        },
        status: {
            path: 'status',
            type: 'codeToValueSet',
            typeParam: 'observationStatus'
        },
        text: {
            path: 'valueString'
        }
    }
};

exports.template = {
    content: {
        result_set: {
            path: 'name.coding.0',
            type: 'concept'
        },
        results: {
            path: 'related.target.reference',
            type: 'template',
            typeParam: result
        }
    }
};

exports.type = 'result';
