"use strict";

var interpretation = [{
    path: 'display'
}];

exports.template = [{
    property: 'vital',
    path: 'name.coding.0',
    type: 'concept'
}, {
    property: 'date_time.point',
    path: 'issued',
    type: 'date'
}, {
    property: 'value',
    path: 'valueQuantity.value'
}, {
    property: 'unit',
    path: 'valueQuantity.units'
}, {
    property: 'interpretations',
    path: 'interpretation.coding',
    type: 'template',
    typeParam: interpretation
}];

exports.type = 'vital';
