"use strict";

var value = require('./value');

var whenGiven = {
    content: {
        low: {
            dataKey: 'start',
            type: 'date'
        },
        high: {
            dataKey: 'end',
            type: 'date'
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
            dataKey: 'quantity',
            type: 'template',
            typeParam: quantity
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
        frequency: {
            constant: true
        }
    }
};

var prescription = {
    content: {
        'administration.interval': {
            dataKey: 'dosageInstruction.0.timingSchedule.repeat',
            type: 'template',
            typeParam: repeat
        },
        sig: {
            dataKey: 'text.div'
        }
    }
};

exports.template = {
    content: {
        date_time: {
            dataKey: 'whenGiven',
            type: 'template',
            typeParam: whenGiven
        },
        status: {
            constant: 'Completed'
        },
        administration: {
            dataKey: 'dosage.0',
            type: 'template',
            typeParam: dosage
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
            dataKey: 'prescription.reference.dosageInstruction.0.timingSchedule.repeat',
            type: 'template',
            typeParam: repeat
        },
        'sig': {
            dataKey: 'prescription.reference.text.div'
        }
    }
};

exports.type = 'medication';
