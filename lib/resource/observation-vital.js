"use strict";

exports.template = {
    content: {
        vital: {
            dataKey: 'name.coding.0',
            type: 'concept'
        },
        'date_time.point': {
            dataKey: 'issued',
            type: 'datetime'
        },
        value: {
            property: 'value',
            dataKey: 'valueQuantity.value'
        },
        unit: {
            dataKey: 'valueQuantity.units'
        },
        interpretations: {
            dataKey: 'interpretation.coding.display',
        }
    }
};

exports.type = 'vital';
