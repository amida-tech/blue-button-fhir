"use strict";

var bbu = require("blue-button-util");

var value = require('./value');

var predicate = bbu.predicate;

var repeat = {
    content: {
        'period.value': {
            dataKey: 'duration'
        },
        'period.unit': {
            dataKey: 'units'
        },
        frequency: true
    }
};

exports.template = {
    type: 'medication',
    content: {
        status: 'Prescribed',
        'date_time.low': {
            value: value.datetime,
            dataKey: 'dateWritten',
            existsWhen: predicate.hasNoProperty('dosageInstruction.0.timingDateTime')
        },
        'date_time.point': {
            value: value.datetime,
            dataKey: 'dateWritten',
            existsWhen: predicate.hasProperty('dosageInstruction.0.timingDateTime')
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
            value: repeat,
            dataKey: 'dosageInstruction.0.timingSchedule.repeat',
            existsWhen: predicate.hasNoProperty('dosageInstruction.0.timingSchedule.repeat.when')
        },
        'administration.interval.event': {
            value: value.codeToValueSet('scheduleWhen'),
            dataKey: 'dosageInstruction.0.timingSchedule.repeat.when'
        },
        'precondition.value': {
            value: value.concept,
            dataKey: 'dosageInstruction.0.asNeededCodeableConcept.coding.0'
        },
        'date_time.high': {
            value: value.datetime,
            dataKey: ['dosageInstruction.0.timingSchedule.repeat.end', 'dosageInstruction.0.timingPeriod.end']
        },
        sig: {
            dataKey: 'text.div'
        }
    }
};
