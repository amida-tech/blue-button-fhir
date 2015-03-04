"use strict";

var value = require('./value');

var repeat = {
    content: {
        'period.value': {
            dataKey: 'duration'
        },
        'period.unit': {
            dataKey: 'units'
        },
        frequency: {
            constant: true
        }
    }
};

exports.template = {
    content: {
        status: {
            constant: 'Prescribed'
        },
        'date_time.low': {
            dataKey: 'dateWritten',
            type: 'datetime',
            condition: 'falsy',
            conditionPath: 'dosageInstruction.0.timingDateTime'
        },
        'date_time.point': {
            dataKey: 'dateWritten',
            type: 'datetime',
            condition: 'truthy',
            conditionPath: 'dosageInstruction.0.timingDateTime'
        },
        'product.product': {
            value: value.concept,
            dataKey: 'medication.reference.code.coding.0'
        },
        'administration.site': {
            value: value.concept,
            dataKey: 'dosageInstruction.0.site.coding.0'
        },
        'administration.route': {
            value: value.concept,
            dataKey: 'dosageInstruction.0.route.coding.0'
        },
        'administration.dose.value': {
            dataKey: 'dosageInstruction.0.doseQuantity.value'
        },
        'administration.dose.unit': {
            dataKey: 'dosageInstruction.0.doseQuantity.units'
        },
        'administration.interval': {
            dataKey: 'dosageInstruction.0.timingSchedule.repeat',
            type: 'template',
            typeParam: repeat,
            conditionPath: 'dosageInstruction.0.timingSchedule.repeat.when',
            condition: 'falsy'
        },
        'administration.interval.event': {
            dataKey: 'dosageInstruction.0.timingSchedule.repeat.when',
            type: 'codeToValueSet',
            typeParam: 'scheduleWhen'
        },
        'precondition.value': {
            value: value.concept,
            dataKey: 'dosageInstruction.0.asNeededCodeableConcept.coding.0'
        },
        'date_time.high': {
            dataKey: ['dosageInstruction.0.timingSchedule.repeat.end', 'dosageInstruction.0.timingPeriod.end'],
            type: 'datetime'
        },
        sig: {
            dataKey: 'text.div'
        }
    }
};

exports.type = 'medication';
