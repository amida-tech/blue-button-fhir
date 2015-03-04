"use strict";

exports.template = {
    content: {
        vital: {
            path: 'name.coding.0',
            type: 'concept'
        },
        'date_time.point': {
            path: 'issued',
            type: 'datetime'
        },
        value: {
            property: 'value',
            path: 'valueQuantity.value'
        },
        unit: {
            path: 'valueQuantity.units'
        },
        interpretations: {
            path: 'interpretation.coding.display',
        }
    }
};

exports.type = 'vital';
