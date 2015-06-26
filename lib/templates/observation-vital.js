"use strict";

var jsonave = require('jsonave');
var value = require('./value');

var jp = jsonave.instance;

exports.template = {
    type: 'vital',
    content: {
        vital: {
            value: value.concept,
            dataKey: 'code.coding[0]'
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
            dataKey: jp('interpretation.coding[*].display')
        }
    }
};
