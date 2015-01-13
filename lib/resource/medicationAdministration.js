"use strict";

var whenGiven = [{
    property: 'low',
    path: 'start',
    type: 'date'
}, {
    property: 'high',
    path: 'end',
    type: 'date'
}];

var quantity = [{
    property: 'value',
    path: 'value'
}, {
    property: 'unit',
    path: 'units'
}];

var dosage = [{
    property: 'route',
    path: 'route.coding.0',
    type: 'concept'
}, {
    property: 'site',
    path: 'site.coding.0',
    type: 'concept'
}, {
    property: 'dose',
    path: 'quantity',
    type: 'template',
    typeParam: quantity
}];

var repeat = [{
    property: 'period.value',
    path: 'duration'
}, {
    property: 'period.unit',
    path: 'units'
}, {
    property: 'frequency',
    type: 'constant',
    typeParam: true
}];

var prescription = [{
    property: 'administration.interval',
    path: 'dosageInstruction.0.timingSchedule.repeat',
    type: 'template',
    typeParam: repeat
}];

module.exports = [{
    property: 'date_time',
    path: 'whenGiven',
    type: 'template',
    typeParam: whenGiven
}, {
    property: 'status',
    type: 'constant',
    typeParam: 'Completed'
}, {
    property: 'administration',
    path: 'dosage.0',
    type: 'template',
    typeParam: dosage
}, {
    property: 'precondition.value',
    path: 'dosage.0.asNeededCodeableConcept.coding.0',
    type: 'concept'
}, {
    property: 'product.product',
    path: 'medication.reference.code.coding.0',
    type: 'concept'
}, {
    path: 'prescription.reference',
    type: 'template',
    typeParam: prescription
}];
