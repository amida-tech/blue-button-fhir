var cases = module.exports = [];

cases[0] = {};

cases[0].resources = [{
  "resource": {
    "id": "MedicationStatement/ms-0-0",
    "resourceType": "MedicationStatement",
    "status": "in-progress",
    "dosage": [{
      "quantity": {
        "value": 1
      },
      "schedule": {
        "repeat": {
          "period": 12,
          "periodUnits": "h"
        }
      }
    }],
    "effectivePeriod": {
      "start": "2013-01-30"
    },
    "contained": [{
      "id": "med",
      "resourceType": "Medication",
      "name": "Oseltamivir 30 MG Oral Capsule",
      "code": {
        "coding": [{
          "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
          "code": "728111",
          "display": "Oseltamivir 30 MG Oral Capsule"
        }],
        "text": "Oseltamivir 30 MG Oral Capsule"
      }
    }],
    "medication": {
      "reference": "#med",
      "display": "Oseltamivir 30 MG Oral Capsule"
    }
  }
}];

cases[0].input = cases[0].resources[0];

cases[0].result = {
  "status": "Prescribed",
  "date_time": {
    "low": {
      "date": "2013-01-30T00:00:00.000Z",
      "precision": "day"
    }
  },
  "product": {
    "product": {
      "name": "Oseltamivir 30 MG Oral Capsule",
      "code": "728111",
      "code_system_name": "RXNORM"
    }
  },
  "administration": {
    "dose": {
      "value": 1
    },
    "interval": {
      "period": {
        "value": 12,
        "unit": "h"
      },
      "frequency": false
    }
  },
  "sig": "Oseltamivir 30 MG Oral Capsule"
};
