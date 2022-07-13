"use strict";

var cases = module.exports = [];

cases[0] = {};

cases[0].resources = [{
  "resource": {
    "id": "AllergyIntolerance/a-0-1",
    "resourceType": "AllergyIntolerance",
    "criticality": "medium",
    "recordedDate": "2006-05-01",
    "status": "confirmed",
    "substance": {
      "coding": [{
        "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
        "code": "2670",
        "display": "Codeine"
      }]
    },
    "event": [{
      "severity": "minor",
      "manifestation": [{
        "coding": [{
          "code": "267036007",
          "system": "http://snomed.info/sct",
          "display": "Shortness of Breath"
        }],
      }]
    }]
  }
}];

cases[0].input = cases[0].resources[0];

cases[0].result = {
  "date_time": {
    "low": {
      "date": "2006-05-01T00:00:00.000Z",
      "precision": "day"
    }
  },
  "observation": {
    "allergen": {
      "name": "Codeine",
      "code": "2670",
      "code_system_name": "RXNORM"
    },
    "status": {
      "name": "Active",
      "code": "55561003",
      "code_system_name": "SNOMED CT"
    },
    "reactions": [{
      "reaction": {
        "name": "Shortness of Breath",
        "code": "267036007",
        "code_system_name": "SNOMED CT"
      },
      "severity": {
        "code": {
          "name": "Mild",
          "code": "255604002",
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

cases[1] = {};

cases[1].resources = [{
  "resource": {
    "id": "AllergyIntolerance/a-1-1",
    "resourceType": "AllergyIntolerance",
    "criticality": "medium",
    "recordedDate": "2006-05-01",
    "status": "confirmed",
    "substance": {
      "coding": [{
        "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
        "code": "DUMMY_CODE",
        "display": "Codeine"
      }]
    },
    "event": [{
      "severity": "minor",
      "manifestation": [{
        "coding": [{
          "code": "267036007",
          "system": "http://snomed.info/sct",
          "display": "Shortness of Breath"
        }]
      }]
    }]
  }
}];

cases[1].input = cases[1].resources[0];

cases[1].result = {
  "date_time": {
    "low": {
      "date": "2006-05-01T00:00:00.000Z",
      "precision": "day"
    }
  },
  "observation": {
    "allergen": {
      "name": "Codeine",
      "code": "DUMMY_CODE",
      "code_system_name": "RXNORM"
    },
    "status": {
      "name": "Active",
      "code": "55561003",
      "code_system_name": "SNOMED CT"
    },
    "reactions": [{
      "reaction": {
        "name": "Shortness of Breath",
        "code": "267036007",
        "code_system_name": "SNOMED CT"
      },
      "severity": {
        "code": {
          "name": "Mild",
          "code": "255604002",
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

cases[2] = {};

cases[2].resources = [{
  "resource": {
    "id": "AllergyIntolerance/a-2-1",
    "resourceType": "AllergyIntolerance",
    "recordedDate": "2014-08-06",
    "status": "confirmed",
    "substance": {
      "text": "Bactrim"
    },
    "event": [{
      "manifestation": [{
        "coding": [{
          "system": "http://snomed.info/sct",
          "code": "112625008",
          "display": "Rash"
        }],
        "text": "Rash"
      }]
    }],
    "patient": {
      "reference": "Patient/0",
      "display": "Jones, Isabella"
    }
  }
}];

cases[2].input = cases[2].resources[0];

cases[2].result = {
  "observation": {
    "status": {
      "name": "Active",
      "code": "55561003",
      "code_system_name": "SNOMED CT"
    },
    "allergen": {
      "name": "Bactrim"
    },
    "reactions": [{
      "reaction": {
        "name": "Rash",
        "code": "112625008",
        "code_system_name": "SNOMED CT"
      }
    }]
  },
  "date_time": {
    "low": {
      "date": "2014-08-06T00:00:00.000Z",
      "precision": "day"
    }
  }
};
