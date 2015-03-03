"use strict";

var cases = module.exports = [];

cases.template = require('../../../lib/resource/observation-result');
cases.type = 'result';

var na = null;

cases[0] = {};

cases[0].resources = [{
    "type": "Observation",
    "id": "or-0-0",
    "body": {
        "resourceType": "Observation",
        "name": {
            "coding": [{
                "system": "http://loinc.org",
                "code": "30313-1",
                "display": "HGB"
            }],
            "text": "HGB"
        },
        "valueQuantity": {
            "value": 10.2,
            "units": "g/dl",
            "code": "g/dl",
            "system": "http://unitsofmeasure.org"
        },
        "issued": "2012-08-10",
        "status": "final",
        "reliability": "ok",
        "subject": na,
        "extension": [{
            "url": "http://infoworld.ro/nxt/Profile/extensions#observation-type",
            "valueCoding": {
                "code": "11502-2",
                "display": "Laboratory report",
                "system": "http://loinc.org"
            }
        }],
        "interpretation": {
            "coding": [{
                "system": "http://hl7.org/fhir/v2/0078",
                "code": "N",
                "display": "Normal"
            }],
            "text": "Normal"
        },
        "referenceRange": [{
            "meaning": {
                "coding": [{
                    "system": "http://hl7.org/fhir/referencerange-meaning",
                    "code": "normal",
                    "display": "Normal Range"
                }],
                "text": "Normal Range"
            },
            "text": "M 13-18 g/dl; F 12-16 g/dl"
        }]
    }
}, {
    "type": "Observation",
    "id": "or-0-1",
    "body": {
        "resourceType": "Observation",
        "name": {
            "coding": [{
                "system": "http://loinc.org",
                "code": "33765-9",
                "display": "WBC"
            }],
            "text": "WBC"
        },
        "valueQuantity": {
            "value": 12.3,
            "units": "10+3/ul",
            "code": "10+3/ul",
            "system": "http://unitsofmeasure.org"
        },
        "issued": "2012-08-10",
        "status": "final",
        "reliability": "ok",
        "subject": na,
        "extension": [{
            "url": "http://infoworld.ro/nxt/Profile/extensions#observation-type",
            "valueCoding": {
                "code": "11502-2",
                "display": "Laboratory report",
                "system": "http://loinc.org"
            }
        }],
        "interpretation": {
            "coding": [{
                "system": "http://hl7.org/fhir/v2/0078",
                "code": "N",
                "display": "Normal"
            }],
            "text": "Normal"
        },
        "referenceRange": [{
            "meaning": {
                "coding": [{
                    "system": "http://hl7.org/fhir/referencerange-meaning",
                    "code": "normal",
                    "display": "Normal Range"
                }],
                "text": "Normal Range"
            },
            "low": {
                "value": 4.3,
                "units": "10+3/ul",
                "code": "10+3/ul",
                "system": "http://unitsofmeasure.org"
            },
            "high": {
                "value": 10.8,
                "units": "10+3/ul",
                "code": "10+3/ul",
                "system": "http://unitsofmeasure.org"
            }
        }]
    }
}, {
    "type": "Observation",
    "id": "or-0-2",
    "body": {
        "resourceType": "Observation",
        "name": {
            "coding": [{
                "system": "http://loinc.org",
                "code": "26515-7",
                "display": "PLT"
            }],
            "text": "PLT"
        },
        "valueQuantity": {
            "value": 123,
            "units": "10+3/ul",
            "code": "10+3/ul",
            "system": "http://unitsofmeasure.org"
        },
        "issued": "2012-08-10",
        "status": "final",
        "reliability": "ok",
        "subject": na,
        "extension": [{
            "url": "http://infoworld.ro/nxt/Profile/extensions#observation-type",
            "valueCoding": {
                "code": "11502-2",
                "display": "Laboratory report",
                "system": "http://loinc.org"
            }
        }],
        "interpretation": {
            "coding": [{
                "system": "http://hl7.org/fhir/v2/0078",
                "code": "L",
                "display": "Low"
            }],
            "text": "Low"
        },
        "referenceRange": [{
            "meaning": {
                "coding": [{
                    "system": "http://hl7.org/fhir/referencerange-meaning",
                    "code": "normal",
                    "display": "Normal Range"
                }],
                "text": "Normal Range"
            },
            "low": {
                "value": 150,
                "units": "10+3/ul",
                "code": "10+3/ul",
                "system": "http://unitsofmeasure.org"
            },
            "high": {
                "value": 350,
                "units": "10+3/ul",
                "code": "10+3/ul",
                "system": "http://unitsofmeasure.org"
            }
        }]
    }
}, {
    "type": "Observation",
    "id": "or-0-3",
    "body": {
        "resourceType": "Observation",
        "name": {
            "coding": [{
                "system": "http://snomed.info/sct",
                "code": "43789009",
                "display": "CBC WO DIFFERENTIAL"
            }],
            "text": "CBC WO DIFFERENTIAL"
        },
        "status": "final",
        "reliability": "ok",
        "subject": na,
        "related": [{
            "type": "has-component",
            "target": {
                "reference": "Observation/or-0-0"
            }
        }, {
            "type": "has-component",
            "target": {
                "reference": "Observation/or-0-1"
            }
        }, {
            "type": "has-component",
            "target": {
                "reference": "Observation/or-0-2"
            }
        }],
        "extension": [{
            "url": "http://infoworld.ro/nxt/Profile/extensions#observation-type",
            "valueCoding": {
                "code": "11502-2",
                "display": "Laboratory report",
                "system": "http://loinc.org"
            }
        }]
    }
}];

cases[0].input = cases[0].resources[3];

cases[0].result = {
    "result_set": {
        "name": "CBC WO DIFFERENTIAL",
        "code": "43789009",
        "code_system_name": "SNOMED CT"
    },
    "results": [{
        "result": {
            "name": "HGB",
            "code": "30313-1",
            "code_system_name": "LOINC"
        },
        "date_time": {
            "point": {
                "date": "2012-08-10T00:00:00.000Z",
                "precision": "day"
            }
        },
        "status": "completed",
        "reference_range": {
            "range": "M 13-18 g/dl; F 12-16 g/dl"
        },
        "interpretations": [
            "Normal"
        ],
        "value": 10.2,
        "unit": "g/dl"
    }, {
        "result": {
            "name": "WBC",
            "code": "33765-9",
            "code_system_name": "LOINC"
        },
        "date_time": {
            "point": {
                "date": "2012-08-10T00:00:00.000Z",
                "precision": "day"
            }
        },
        "status": "completed",
        "reference_range": {
            "low": "4.3",
            "high": "10.8",
            "unit": "10+3/ul"
        },
        "interpretations": [
            "Normal"
        ],
        "value": 12.3,
        "unit": "10+3/ul"
    }, {
        "result": {
            "name": "PLT",
            "code": "26515-7",
            "code_system_name": "LOINC"
        },
        "date_time": {
            "point": {
                "date": "2012-08-10T00:00:00.000Z",
                "precision": "day"
            }
        },
        "status": "completed",
        "reference_range": {
            "low": "150",
            "high": "350",
            "unit": "10+3/ul"
        },
        "interpretations": [
            "Low"
        ],
        "value": 123,
        "unit": "10+3/ul"
    }]
};
