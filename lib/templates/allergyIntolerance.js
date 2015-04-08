"use strict";

var bbu = require("blue-button-util");

var value = require('./value');

var predicate = bbu.predicate;

var jp = bbu.jsonpath.instance;

var severity = {
    content: {
        code: value.codeToValueSet('criticality')
    }
};

var reaction = {
    content: {
        reaction: {
            value: value.concept,
            dataKey: jp('reference.getResource().symptom[0].code.coding[0]')
        },
        'severity.code': {
            value: value.codeToValueSet('reactionSeverity'),
            dataKey: jp('reference.getResource().symptom[0].severity')
        }
    }
};

var allergyObservation = {
    content: {
        severity: {
            value: severity,
            dataKey: 'criticality'
        },
        status: {
            value: value.codeToValueSet('sensitivityStatus'),
            dataKey: 'status'
        },
        allergen: {
            value: value.concept,
            dataKey: jp('substance.reference.getResource().type.coding[0]')
        },
        'allergen.name': {
            dataKey: jp('substance.reference.getResource().type.text')
        },
        reactions: {
            value: reaction,
            dataKey: 'reaction'
        }
    }
};

exports.template = {
    type: 'allergy',
    content: {
        observation: allergyObservation,
        'date_time.low': {
            value: value.datetime,
            dataKey: 'recordedDate'
        }
    }
};
