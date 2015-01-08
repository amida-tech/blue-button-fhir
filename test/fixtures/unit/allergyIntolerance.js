"use strict";

var cases = module.exports = [];

var na = null;

cases[0] = {};

cases[0].resources = [{
    "type": "AdverseReaction",
    "id": "0",
    "body": {
        "resourceType": "AdverseReaction",
        "subject": na,
        "symptom": [{
            "severity": "minor",
            "code": {
                "coding": [{
                    "code": "267036007",
                    "system": "http://snomed.info/sct",
                    "display": "Shortness of Breath"
                }],
                "text": na
            }
        }],
        "didNotOccurFlag": false
    }
}, {
    "type": "AllergyIntolerance",
    "id": "1",
    "body": {
        "resourceType": "AllergyIntolerance",
        "criticality": "medium",
        "sensitivityType": "allergy",
        "recordedDate": "2006-05-01",
        "status": "confirmed",
        "subject": na,
        "substance": {
            "reference": "Substance/2",
            "display": na
        },
        "reaction": [{
            "reference": "AdverseReaction/0",
            "display": na
        }]
    }
}, {
    "type": "Substance",
    "id": "2",
    "body": {
        "resourceType": "Substance",
        "text": na,
        "type": {
            "coding": [{
                "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                "code": "2670",
                "display": "Codeine"
            }],
            "text": na
        }
    }
}];

cases[0].input = cases[0].resources[1];

cases[0].result = {
    "identifiers": na,
    "date_time": {
        "point": {
            "date": "2006-05-01T00:00:00.000Z",
            "precision": "day"
        },
        "low": {
            "date": "2006-05-01T00:00:00.000Z",
            "precision": "day"
        },
        "high": {
            "date": "2012-08-06T00:00:00.000Z",
            "precision": "day"
        }
    },
    "problemStatus": "completed",
    "observation": {
        "identifiers": na,
        "allergen": {
            "name": "Codeine",
            "code": "2670",
            "code_system_name": "RXNORM"
        },
        "intolerance": {
            "name": "Propensity to adverse reaction to drug",
            "code": "419511003",
            "code_system_name": "SNOMED CT"
        },
        "date_time": {
            "low": {
                "date": "2006-05-01T00:00:00.000Z",
                "precision": "day"
            }
        },
        "status": {
            "name": "Active",
            "code": "55561003",
            "code_system_name": "SNOMED CT"
        },
        "reactions": [{
            "identifiers": na,
            "date_time": {
                "low": {
                    "date": "2006-05-01T00:00:00.000Z",
                    "precision": "day"
                }
            },
            "reaction": {
                "name": "Shortness of Breath",
                "code": "267036007",
                "code_system_name": "SNOMED CT"
            },
            "free_text_reaction": "Shortness of Breath",
            "severity": {
                "code": {
                    "name": "Mild to moderate",
                    "code": "371923003",
                    "code_system_name": "SNOMED CT"
                }
            }
        }],
        "severity": {
            "code": {
                "name": "Moderate",
                "code": "6736007",
                "code_system_name": "SNOMED CT"
            }
        }
    }
};
