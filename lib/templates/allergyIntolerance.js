"use strict";

var _ = require('lodash');
var bbu = require("blue-button-util");

var value = require('./value');

var predicate = bbu.predicate;

var jp = bbu.jsonpath.instance;
var pr = bbu.predicate;

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
            value: value.conceptWithDefaultFromText,
            dataKey: 'substance'
        },
        reactions: {
            value: reaction,
            dataKey: function (input) {
                if (input.event) {
                    var result = input.event.reduce(function (r, event) {
                        var n = event.manifestation && event.manifestation.length;
                        if (n > 1) {
                            event.manifestation.forEach(function (m) {
                                var ne = _.cloneDeep(event);
                                ne.manifestation = [m];
                                r.push(ne);
                            });
                        } else {
                            r.push(event);
                        }
                        return r;
                    }, []);
                    if (result.length) {
                        return result;
                    } else {
                        return null;
                    }
                }
                return null;
            }
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
