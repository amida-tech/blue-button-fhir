"use strict";

var bbu = require('blue-button-util');

var value = require('./value');

var jp = bbu.jsonpath.instance;

exports.template = {
    type: 'demographics',
    content: {
        name: {
            content: {
                middle: {
                    dataKey: jp('given[1:]')
                },
                last: {
                    dataKey: jp('family[0]')
                },
                first: {
                    dataKey: jp('given[0]')
                }
            },
            dataKey: "name"
        },
        "dob.point": {
            value: value.date,
            dataKey: 'birthdate'
        },
        gender: {
            dataKey: jp('gender.coding[0].display')
        },
        identifiers: {
            content: {
                identifier: {
                    value: function (input) {
                        return input.substring(8);
                    },
                    dataKey: 'system'
                },
                extension: {
                    dataKey: 'value'
                }
            },
            dataKey: jp('identifier[*]')
        },
        marital_status: {
            dataKey: jp('maritalStatus.coding[0].display')
        },
        addresses: {
            content: {
                street_lines: {
                    dataKey: 'line'
                },
                city: {
                    dataKey: 'city'
                },
                state: {
                    dataKey: 'state'
                },
                zip: {
                    dataKey: 'zip'
                },
                country: {
                    dataKey: 'country'
                },
                use: {
                    value: value.codeToValueSet('addressUse'),
                    dataKey: 'use'
                }
            },
            dataKey: 'address'
        },
        phone: {
            content: {
                number: {
                    dataKey: 'value'
                },
                type: {
                    value: value.codeToValueSet('phoneUse'),
                    dataKey: 'use'
                }
            },
            dataKey: jp('telecom[?(@.system==="phone")]')
        },
        religion: {
            dataKey: jp('extension[?(@.url==="http://hl7.org/fhir/StructureDefinition/us-core-religion")].valueCodeableConcept.coding[0].display'),
            single: true
        },
        race: {
            dataKey: jp('extension[?(@.url==="http://hl7.org/fhir/Profile/us-core#race")].valueCodeableConcept.coding[0].display'),
            single: true
        },
        ethnicity: {
            dataKey: jp('extension[?(@.url==="http://hl7.org/fhir/Profile/us-core#ethnicity")].valueCodeableConcept.coding[0].display'),
            single: true
        }
    }
};
