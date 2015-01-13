"use strict";

var severity = [{
    property: 'code',
    type: 'codeToValueSet',
    typeParam: 'criticality'
}];

var reactionContent = [{
    property: 'reaction',
    path: 'symptom.0.code.coding.0',
    type: 'concept'
}, {
    property: 'severity.code',
    path: 'symptom.0.severity',
    type: 'codeToValueSet',
    typeParam: 'reactionSeverity'
}];

var reaction = [{
    path: 'reference',
    type: 'template',
    typeParam: reactionContent
}];

var allergyObservation = [{
    property: 'severity',
    path: 'criticality',
    type: 'template',
    typeParam: severity
}, {
    property: 'status',
    path: 'status',
    type: 'codeToValueSet',
    typeParam: 'sensitivityStatus'
}, {
    property: 'allergen',
    path: 'substance.reference.type.coding.0',
    type: 'concept'
}, {
    property: 'allergenName',
    path: 'substance.reference.type.text'
}, {
    property: 'reactions',
    path: 'reaction',
    type: 'template',
    typeParam: reaction
}];

exports.template = [{
    property: 'observation',
    type: 'template',
    typeParam: allergyObservation
}, {
    property: 'date_time.low',
    path: 'recordedDate',
    type: 'datetime'
}];

exports.type = 'allergy';
