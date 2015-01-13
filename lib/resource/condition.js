"use strict";

var problem = [{
    property: 'code',
    path: 'code.coding.0',
    type: 'concept'
}, {
    property: 'date_time.low',
    path: 'onsetDate',
    type: 'date'
}, {
    property: 'date_time.high',
    path: 'abatementDate',
    type: 'date'
}];

exports.template = [{
    property: 'problem',
    type: 'template',
    typeParam: problem
}, {
    property: 'status.name',
    path: 'abatementBoolean',
    type: 'boolToConstant',
    typeParam: ['Resolved', null]
}];

exports.type = 'problem';
