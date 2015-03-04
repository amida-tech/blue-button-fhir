"use strict";

var whenGiven = {
    content: {
        low: {
            path: 'start',
            type: 'date'
        },
        high: {
            path: 'end',
            type: 'date'
        }
    }
};

var quantity = {
    content: {
        value: {
            path: 'value'
        },
        unit: {
            path: 'units'
        }
    }
};

var dosage = {
    content: {
        route: {
            path: 'route.coding.0',
            type: 'concept'
        },
        site: {
            path: 'site.coding.0',
            type: 'concept'
        },
        dose: {
            path: 'quantity',
            type: 'template',
            typeParam: quantity
        }
    }
};

var repeat = {
    content: {
        'period.value': {
            path: 'duration'
        },
        'period.unit': {
            path: 'units'
        },
        frequency: {
            type: 'constant',
            typeParam: true
        }
    }
};

var prescription = {
    content: {
        'administration.interval': {
            path: 'dosageInstruction.0.timingSchedule.repeat',
            type: 'template',
            typeParam: repeat
        },
        sig: {
            path: 'text.div'
        }
    }
};

exports.template = {
    content: {
        date_time: {
            path: 'whenGiven',
            type: 'template',
            typeParam: whenGiven
        },
        status: {
            type: 'constant',
            typeParam: 'Completed'
        },
        administration: {
            path: 'dosage.0',
            type: 'template',
            typeParam: dosage
        },
        'precondition.value': {
            path: 'dosage.0.asNeededCodeableConcept.coding.0',
            type: 'concept'
        },
        'product.product': {
            path: 'medication.reference.code.coding.0',
            type: 'concept'
        },
        'administration.interval': {
            path: 'prescription.reference.dosageInstruction.0.timingSchedule.repeat',
            type: 'template',
            typeParam: repeat
        },
        'sig': {
            path: 'prescription.reference.text.div'
        }
    }
};

exports.type = 'medication';
