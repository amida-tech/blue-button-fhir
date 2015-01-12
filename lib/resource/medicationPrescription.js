"use strict";

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

module.exports = [{
    property: 'status',
    type: 'constant',
    typeParam: 'Prescribed'
}, {
    property: 'date_time.point',
    path: 'dateWritten',
    type: 'datetime'
}, {
    property: 'product.product',
    path: 'medication.reference.code.coding.0',
    type: 'concept'
}, {
    property: 'administration.site',
    path: 'dosageInstruction.0.site.coding.0',
    type: 'concept'
}, {
    property: 'administration.route',
    path: 'dosageInstruction.0.route.coding.0',
    type: 'concept'
}, {
    property: 'administration.dose.value',
    path: 'dosageInstruction.0.doseQuantity.value'
}, {
    property: 'administration.dose.unit',
    path: 'dosageInstruction.0.doseQuantity.units'
}, {
    property: 'administration.interval',
    path: 'dosageInstruction.0.timingSchedule.repeat',
    type: 'template',
    typeParam: repeat
}, {
    property: 'precondition.value',
    path: 'dosageInstruction.0.asNeededCodeableConcept.coding.0',
    type: 'concept'
}];
