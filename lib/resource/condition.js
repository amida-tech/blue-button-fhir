"use strict";

var engine = require('../engine');

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

var problemBody = [{
    property: 'problem',
    type: problem
}, {
    property: 'status.name',
    path: 'abatementBoolean',
    type: 'boolToConstant',
    typeParam: ['Resolved', null]
}];

exports.toModel = function (store, resource) {
    var resourceDict = Object.create(store.index);
    var contained = resource.contained;
    if (contained) {
        var id = contained.id;
        if (id[0] === '#') {
            id = id.substring(1);
        }
        resourceDict[id] = contained;
    }
    var result = engine(resourceDict, problemBody, resource);
    return {
        type: 'problem',
        value: result
    };
};
