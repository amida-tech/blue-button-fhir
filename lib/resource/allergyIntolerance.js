"use strict";

var severity = {
    content: {
        code: {
            type: 'codeToValueSet',
            typeParam: 'criticality'
        }
    }
};

var reaction = {
    content: {
        reaction: {
            dataKey: 'reference.symptom.0.code.coding.0',
            type: 'concept'
        },
        'severity.code': {
            dataKey: 'reference.symptom.0.severity',
            type: 'codeToValueSet',
            typeParam: 'reactionSeverity'
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
            dataKey: 'status',
            type: 'codeToValueSet',
            typeParam: 'sensitivityStatus'
        },
        allergen: {
            dataKey: 'substance.reference.type.coding.0',
            type: 'concept'
        },
        'allergen.name': {
            dataKey: 'substance.reference.type.text',
            condition: 'falsy',
            conditionPath: 'substance.reference.type.coding.0'
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
            dataKey: 'recordedDate',
            type: 'datetime'
        }
    }
};

exports.type = 'allergy';
