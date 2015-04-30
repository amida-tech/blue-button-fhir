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
            dataKey: jp('manifestation[0].coding[0]')
        },
        'severity.code': {
            value: value.codeToValueSet('reactionSeverity'),
            dataKey: 'severity'
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
            dataKey: jp('substance.coding[0]')
        },
        reactions: {
            value: reaction,
            dataKey: 'event'
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
