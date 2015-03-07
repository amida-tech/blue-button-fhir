"use strict";

var value = require('./value');

var whenGiven = {
    content: {
        low: {
            value: value.date,
            dataKey: 'start'
        },
        high: {
            value: value.date,
            dataKey: 'end'
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
            dataKey: 'route.coding.0'
        },
        site: {
            value: value.concept,
            dataKey: 'site.coding.0',
        },
        dose: {
            value: quantity,
            dataKey: 'quantity'
        }
    }
};

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

var prescription = {
    content: {
        'administration.interval': {
            value: repeat,
            dataKey: 'dosageInstruction.0.timingSchedule.repeat'
        },
        sig: {
            dataKey: 'text.div'
        }
    }
};

exports.template = {
    type: 'medication',
    content: {
        date_time: {
            value: whenGiven,
            dataKey: 'whenGiven'
        },
        status: 'Completed',
        administration: {
            value: dosage,
            dataKey: 'dosage.0'
        },
        'precondition.value': {
            value: value.concept,
            dataKey: 'dosage.0.asNeededCodeableConcept.coding.0'
        },
        'product.product': {
            value: value.concept,
            dataKey: 'medication.reference.code.coding.0',
        },
        'administration.interval': {
            value: repeat,
            dataKey: 'prescription.reference.dosageInstruction.0.timingSchedule.repeat',
        },
        'sig': {
            dataKey: 'prescription.reference.text.div'
        }
    }
};
