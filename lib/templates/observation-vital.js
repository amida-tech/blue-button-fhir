"use strict";

var bbu = require("blue-button-util");

var value = require('./value');

var predicate = bbu.predicate;

var jp = bbu.jsonpath.instance;

exports.template = {
    type: 'vital',
    content: {
        vital: {
            value: value.concept,
            dataKey: jp('name.coding[0]')
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
