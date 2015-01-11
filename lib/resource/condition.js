"use strict";

var problem = [{
    property: 'code',
    path: 'code.coding.0',
    type: 'concept'
}, {
    property: 'date_time.low',
    path: 'onsetDate',
    type: 'datetime'
}, {
    property: 'date_time.high',
    path: 'abatementDate',
    type: 'datetime'
}];

module.exports = [{
    property: 'problem',
    type: 'template',
    typeParam: problem
}, {
    property: 'status.name',
    path: 'abatementBoolean',
    type: 'boolToConstant',
    typeParam: ['Resolved', null]
}];
