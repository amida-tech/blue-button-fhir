"use strict";

var cases = module.exports = [];

var na = null;

cases[0] = {};

cases[0].resources = [{
    "type": "MedicationPrescription",
    "id": "0",
    "body": {
        "resourceType": "MedicationPrescription",
        "status": "completed",
        "patient": na,
        "dateWritten": "2012-08-06",
        "dosageInstruction": [{
            "route": {
                "coding": [{
                    "code": "C38216",
                    "system": "urn:oid:2.16.840.1.113883.3.26.1.1",
                    "display": "RESPIRATORY (INHALATION)"
                }],
                "text": "RESPIRATORY (INHALATION)"
            },
            "doseQuantity": {
                "value": 0.09,
                "units": "mg/actuat",
                "code": "mg/actuat",
                "system": "http://unitsofmeasure.org"
            },
            "timingSchedule": {
                "event": [{
                    "start": "2012-08-06"
                }],
                "repeat": {
                    "frequency": 1,
                    "duration": 12,
                    "units": "h",
                    "end": "2012-08-13"
                }
            },
            "asNeededCodeableConcept": {
                "coding": [{
                    "system": "http://snomed.info/sct",
                    "code": "56018004",
                    "display": "Wheezing"
                }],
                "text": "Wheezing"
            }
        }],
        "text": {
            "status": "generated",
            "div": "Albuterol 0.09 MG/ACTUAT inhalant solution"
        },
        "medication": {
            "reference": "Medication/1"
        }
    }
}, {
    "type": "Medication",
    "id": "1",
    "body": {
        "resourceType": "Medication",
        "text": {
            "status": "generated",
            "div": "<div><p><br/><b>Generated Narrative</b></p><br/><p><b>name</b>: Albuterol 0.09 MG/ACTUAT Inhalant Solution [Ventolin HFA]</p><br/><p><b>code</b>:<span title=\"Codes: {http://www.nlm.nih.gov/research/umls/rxnorm 351656}\">Albuterol 0.09 MG/ACTUAT Inhalant Solution [Ventolin HFA]</span></p><br/><p><b>isBrand</b>:true</p><br/><p><b>kind</b>: product</p><br/><p><b>product</b></p><br/><p><b>form</b>: <span title=\"Codes: {http://www.nlm.nih.gov/research/umls/rxnorm 346161}\">Inhalant Solution</span> </p></div>"
        },
        "name": "Albuterol 0.09 MG/ACTUAT Inhalant Solution [Ventolin HFA]",
        "code": {
            "coding": [{
                "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                "code": "351656",
                "display": "Albuterol 0.09 MG/ACTUAT Inhalant Solution [Ventolin HFA]"
            }],
            "text": "Albuterol 0.09 MG/ACTUAT Inhalant Solution [Ventolin HFA]"
        },
        "isBrand": true,
        "kind": "product",
        "product": {
            "form": {
                "coding": [{
                    "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
                    "code": "346161",
                    "display": "Inhalant Solution"
                }]
            }
        }
    }
}];

cases[0].input = cases[0].resources[0];

cases[0].result = {
    "date_time": {
        "low": {
            "date": "2012-08-06T00:00:00.000Z",
            "precision": "day"
        },
        "high": {
            "date": "2012-08-13T00:00:00.000Z",
            "precision": "day"
        }
    },
    "status": "Prescribed",
    "sig": "Albuterol 0.09 MG/ACTUAT inhalant solution",
    "product": {
        "product": {
            "name": "Albuterol 0.09 MG/ACTUAT Inhalant Solution [Ventolin HFA]",
            "code": "351656",
            "code_system_name": "RXNORM"
        }
    },
    "administration": {
        "route": {
            "name": "RESPIRATORY (INHALATION)",
            "code": "C38216",
            "code_system_name": "Medication Route FDA"
        },
        "dose": {
            "value": 0.09,
            "unit": "mg/actuat"
        },
        "interval": {
            "period": {
                "value": 12,
                "unit": "h"
            },
            "frequency": true
        }
    },
    "precondition": {
        "value": {
            "name": "Wheezing",
            "code": "56018004",
            "code_system_name": "SNOMED CT"
        }
    }
};
