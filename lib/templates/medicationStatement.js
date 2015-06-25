"use strict";

var _ = require('lodash');
var bbu = require('blue-button-util');
var jsonave = require('jsonave');
var value = require('./value');

var pr = bbu.predicate;

var jp = jsonave.instance;

var effectiveTime = {
    content: {
        low: {
            value: value.date,
            dataKey: 'effectivePeriod.start'
        },
        high: {
            value: value.date,
            dataKey: 'effectivePeriod.end'
        },
        point: {
            value: value.date,
            dataKey: 'effectiveTimeDateTime'
        }
    }
};

var quantity = {
    content: {
        value: {
            dataKey: 'value'
        },
        unit: {
            dataKey: 'units'
        }
    }
};

var dosage = {
    content: {
        route: {
            value: value.concept,
            dataKey: 'route.coding[0]'
        },
        site: {
            value: value.concept,
            dataKey: 'site.coding[0]',
        },
        dose: {
            value: quantity,
            dataKey: 'quantity'
        }
    }
};

var repeatPeriod = {
    content: {
        'period.value': {
            dataKey: 'period'
        },
        'period.unit': {
            dataKey: 'periodUnits'
        },
        frequency: false
    },
    existsWhen: _.partialRight(_.has, 'period')
};

var repeatDuration = {
    content: {
        'period.value': {
            dataKey: 'duration'
        },
        'period.unit': {
            dataKey: 'durationUnits'
        },
        frequency: true
    },
    existsWhen: pr.and([_.partialRight(_.has, 'duration'), _.negate(_.partialRight(_.has, 'period'))])
};

var repeatPeriod = {
    content: {
        'period.value': {
            dataKey: 'period'
        },
        'period.unit': {
            dataKey: 'periodUnits'
        },
        frequency: false
    },
    existsWhen: _.partialRight(_.has, 'period')
};

var repeat = {
    content: {
        'period.value': {
            dataKey: 'duration'
        },
        'period.unit': {
            dataKey: 'durationUnits'
        },
        frequency: true
    },
    existsWhen: _.partialRight(_.has, 'period')
};

exports.template = {
    type: 'medication',
    content: {
        status: {
            value: function (input) {
                return input === 'completed' ? 'Completed' : 'Prescribed';
            },
            dataKey: 'status'
        },
        date_time: {
            value: effectiveTime
        },
        'product.product': {
            value: value.concept,
            dataKey: jp('medication.reference.getResource().code.coding[0]'),
        },
        administration: {
            value: dosage,
            dataKey: 'dosage[0]'
        },
        'precondition.value': {
            value: value.concept,
            dataKey: 'dosage[0].asNeededCodeableConcept.coding[0]'
        },
        'administration.interval': {
            assign: [repeatPeriod, repeatDuration],
            dataKey: 'dosage[0].schedule.repeat',
            existsWhen: pr.hasNoProperty('dosage[0].schedule.repeat.when')
        },
        'administration.interval.event': {
            value: value.codeToValueSet('scheduleWhen'),
            dataKey: 'dosage[0].schedule.repeat.when'
        },
        'sig': {
            dataKey: jp('medication.reference.getResource().code.coding[0].display')
        }
    }
};
