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

exports.template = [{
    property: 'status',
    type: 'constant',
    typeParam: 'Prescribed'
}, {
    property: 'date_time.low',
    path: 'dateWritten',
    type: 'datetime',
    condition: 'falsy',
    conditionPath: 'dosageInstruction.0.timingDateTime'
}, {
    property: 'date_time.point',
    path: 'dateWritten',
    type: 'datetime',
    condition: 'truthy',
    conditionPath: 'dosageInstruction.0.timingDateTime'
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
    typeParam: repeat,
    conditionPath: 'dosageInstruction.0.timingSchedule.repeat.when',
    condition: 'falsy'
}, {
    property: 'administration.interval.event',
    path: 'dosageInstruction.0.timingSchedule.repeat.when',
    type: 'codeToValueSet',
    typeParam: 'scheduleWhen'
}, {
    property: 'precondition.value',
    path: 'dosageInstruction.0.asNeededCodeableConcept.coding.0',
    type: 'concept'
}, {
    property: 'date_time.high',
    path: 'dosageInstruction.0.timingSchedule.repeat.end',
    'type': 'datetime'
}, {
    property: 'date_time.high',
    path: 'dosageInstruction.0.timingPeriod.end',
    'type': 'datetime'
}, {
    property: 'sig',
    path: 'text.div'
}];

exports.type = 'medication';
