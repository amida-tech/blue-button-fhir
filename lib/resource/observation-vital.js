"use strict";

var value = require('./value');

exports.template = {
    content: {
        vital: {
            value: value.concept,
            dataKey: 'name.coding.0'
        },
        'date_time.point': {
            value: value.datetime,
            dataKey: 'issued'
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
