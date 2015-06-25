"use strict";

var jsonave = require('jsonave');
var value = require('./value');

var jp = jsonave.instance;

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
            dataKey: ['low.units', 'high.units']
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
            dataKey: 'code.coding[0]'
        },
        value: {
            dataKey: 'valueQuantity.value'
        },
        unit: {
            dataKey: 'valueQuantity.units'
        },
        interpretations: {
            value: value.interpretation,
            dataKey: 'interpretation.coding',
        },
        reference_range: {
            value: referenceRange,
            dataKey: 'referenceRange[0]'
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
    type: 'result',
    content: {
        result_set: {
            value: value.concept,
            dataKey: 'code.coding[0]'
        },
        results: {
            value: result,
            dataKey: jp('related[*].target.reference.getResource()')
        }
    }
};
