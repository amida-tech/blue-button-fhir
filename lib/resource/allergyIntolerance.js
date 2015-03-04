"use strict";

var value = require('./value');
var condition = require('../engine/condition');

var severity = {
    content: {
        code: {
            value: value.codeToValueSet('criticality')
        }
    }
};

var reaction = {
    content: {
        reaction: {
            value: value.concept,
            dataKey: 'reference.symptom.0.code.coding.0'
        },
        'severity.code': {
            value: value.codeToValueSet('reactionSeverity'),
            dataKey: 'reference.symptom.0.severity'
        }
    }
};

var allergyObservation = {
    content: {
        severity: {
            dataKey: 'criticality',
            type: 'template',
            typeParam: severity
        },
        status: {
            value: value.codeToValueSet('sensitivityStatus'),
            dataKey: 'status'
        },
        allergen: {
            value: value.concept,
            dataKey: 'substance.reference.type.coding.0'
        },
        'allergen.name': {
            dataKey: 'substance.reference.type.text',
            existsWhen: condition.noProperty('substance.reference.type.coding.0')
        },
        reactions: {
            dataKey: 'reaction',
            type: 'template',
            typeParam: reaction
        }
    }
};

exports.template = {
    content: {
        observation: {
            type: 'template',
            typeParam: allergyObservation
        },
        'date_time.low': {
            value: value.datetime,
            dataKey: 'recordedDate'
        }
    }
};

exports.type = 'allergy';
