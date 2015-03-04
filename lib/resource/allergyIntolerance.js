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
            path: 'reference.symptom.0.code.coding.0',
            type: 'concept'
        },
        'severity.code': {
            path: 'reference.symptom.0.severity',
            type: 'codeToValueSet',
            typeParam: 'reactionSeverity'
        }
    }
};

var allergyObservation = {
    content: {
        severity: {
            path: 'criticality',
            type: 'template',
            typeParam: severity
        },
        status: {
            path: 'status',
            type: 'codeToValueSet',
            typeParam: 'sensitivityStatus'
        },
        allergen: {
            path: 'substance.reference.type.coding.0',
            type: 'concept'
        },
        'allergen.name': {
            path: 'substance.reference.type.text',
            condition: 'falsy',
            conditionPath: 'substance.reference.type.coding.0'
        },
        reactions: {
            path: 'reaction',
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
            path: 'recordedDate',
            type: 'datetime'
        }
    }
};

exports.type = 'allergy';
