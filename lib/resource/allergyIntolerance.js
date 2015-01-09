"use strict";

var engine = require('../engine');

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
    path: 'reference.body',
    type: reactionContent
}];

var allergyObservation = [{
    property: 'severity',
    path: 'criticality',
    type: severity
}, {
    property: 'status',
    path: 'status',
    type: 'codeToValueSet',
    typeParam: 'sensitivityStatus'
}, {
    property: 'allergen',
    path: 'substance.reference.body.type.coding.0',
    type: 'concept'
}, {
    property: 'reactions',
    path: 'reaction',
    cardinality: 'array',
    type: reaction
}];

var allergyBody = [{
    property: 'observation',
    type: allergyObservation
}, {
    property: 'date_time.low',
    path: 'recordedDate',
    type: 'datetime'
}];

exports.toModel = function (app, resource, callback) {
    var result = engine(app, allergyBody, resource.body);
    callback(null, {
        type: 'allergy',
        value: result
    });
};
