"use strict";

var repeat = {
    content: {
        'period.value': {
            path: 'duration'
        },
        'period.unit': {
            path: 'units'
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
            path: 'dateWritten',
            type: 'datetime',
            condition: 'falsy',
            conditionPath: 'dosageInstruction.0.timingDateTime'
        },
        'date_time.point': {
            path: 'dateWritten',
            type: 'datetime',
            condition: 'truthy',
            conditionPath: 'dosageInstruction.0.timingDateTime'
        },
        'product.product': {
            path: 'medication.reference.code.coding.0',
            type: 'concept'
        },
        'administration.site': {
            path: 'dosageInstruction.0.site.coding.0',
            type: 'concept'
        },
        'administration.route': {
            path: 'dosageInstruction.0.route.coding.0',
            type: 'concept'
        },
        'administration.dose.value': {
            path: 'dosageInstruction.0.doseQuantity.value'
        },
        'administration.dose.unit': {
            path: 'dosageInstruction.0.doseQuantity.units'
        },
        'administration.interval': {
            path: 'dosageInstruction.0.timingSchedule.repeat',
            type: 'template',
            typeParam: repeat,
            conditionPath: 'dosageInstruction.0.timingSchedule.repeat.when',
            condition: 'falsy'
        },
        'administration.interval.event': {
            path: 'dosageInstruction.0.timingSchedule.repeat.when',
            type: 'codeToValueSet',
            typeParam: 'scheduleWhen'
        },
        'precondition.value': {
            path: 'dosageInstruction.0.asNeededCodeableConcept.coding.0',
            type: 'concept'
        },
        'date_time.high': {
            path: ['dosageInstruction.0.timingSchedule.repeat.end', 'dosageInstruction.0.timingPeriod.end'],
            type: 'datetime'
        },
        sig: {
            path: 'text.div'
        }
    }
};

exports.type = 'medication';
