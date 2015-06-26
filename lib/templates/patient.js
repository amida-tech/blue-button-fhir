"use strict";

var jsonave = require('jsonave');

var value = require('./value');

var jp = jsonave.instance;

exports.template = {
    type: 'demographics',
    content: {
        name: {
            content: {
                middle: {
                    dataKey: jp('given[1:]')
                },
                last: {
                    dataKey: 'family[0]'
                },
                first: {
                    dataKey: 'given[0]'
                },
                prefix: {
                    dataKey: 'prefix[0]'
                },
                suffix: {
                    dataKey: 'suffix[0]'
                }
            },
            dataKey: 'name[0]'
        },
        "dob.point": {
            value: value.date,
            dataKey: 'birthDate'
        },
        gender: {
            value: value.codeToValueSet('gender'),
            dataKey: 'gender'
        },
        identifiers: {
            content: {
                identifier: {
                    value: function (input) {
                        if (input.substring(0, 8) === 'urn:oid:') {
                            return input.substring(8);
                        } else {
                            return input;
                        }
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
            dataKey: 'maritalStatus.coding[0].display'
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
                    dataKey: 'postalCode'
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
        email: {
            content: {
                address: {
                    dataKey: 'value'
                }
            },
            dataKey: jp('telecom[?(@.system==="email")]')
        },
        religion: {
            dataKey: jp('extension[?(@.url==="http://hl7.org/fhir/StructureDefinition/us-core-religion")].valueCodeableConcept.coding[0].display'),
            single: true
        },
        race: {
            dataKey: jp('extension[?(@.url==="http://hl7.org/fhir/StructureDefinition/us-core-race")].valueCodeableConcept.coding[0].display'),
            single: true
        },
        ethnicity: {
            dataKey: jp('extension[?(@.url==="http://hl7.org/fhir/StructureDefinition/us-core-ethnicity")].valueCodeableConcept.coding[0].display'),
            single: true
        },
        languages: {
            content: {
                language: {
                    dataKey: 'language.coding[0].code'
                },
                preferred: {
                    dataKey: 'preferred'
                }
            },
            dataKey: 'communication'
        }
    }
};
