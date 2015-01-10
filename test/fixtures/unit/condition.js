"use strict";

var cases = module.exports = [];

cases[0] = {};

cases[0].resources = [];

cases[0].input = {
    "type": "Condition",
    "id": "0",
    "body": {
        "resourceType": "Condition",
        "status": "confirmed",
        "subject": {
            "reference": "Patient/add70d80-2f87-11e4-a02b-699a62c7658f",
            "display": "PAC-PATRU TESTPATRU X"
        },
        "onsetDate": "2012-08-05",
        "dateAsserted": "2012-08-05",
        "abatementBoolean": true,
        "code": {
            "coding": [{
                "code": "233604007",
                "system": "http://snomed.info/sct",
                "display": "Pneumonia"
            }],
            "text": "Pneumonia"
        }
    }
};

cases[0].result = {
    "problem": {
        "code": {
            "name": "Pneumonia",
            "code": "233604007",
            "code_system_name": "SNOMED CT"
        },
        "date_time": {
            "low": {
                "date": "2012-08-05T00:00:00.000Z",
                "precision": "day"
            }
        }
    },
    "status": {
        "name": "Resolved"
    }
};

cases[1] = {};

cases[1].resources = [];

cases[1].input = {
    "type": "Condition",
    "id": "1",
    "body": {
        "resourceType": "Condition",
        "status": "confirmed",
        "subject": {
            "reference": "Patient/add70d80-2f87-11e4-a02b-699a62c7658f",
            "display": "PAC-PATRU TESTPATRU X"
        },
        "onsetDate": "2007-01-03",
        "dateAsserted": "2007-01-03",
        "code": {
            "coding": [{
                "code": "195967001",
                "system": "http://snomed.info/sct",
                "display": "Asthma"
            }],
            "text": "Asthma"
        }
    }
};

cases[1].result = {
    "problem": {
        "code": {
            "name": "Asthma",
            "code": "195967001",
            "code_system_name": "SNOMED CT"
        },
        "date_time": {
            "low": {
                "date": "2007-01-03T00:00:00.000Z",
                "precision": "day"
            }
        }
    }
};

cases[2] = {};

cases[2].resources = [];

cases[2].input = {
    "type": "Condition",
    "id": "2",
    "body": {
        "resourceType": "Condition",
        "status": "confirmed",
        "subject": {
            "reference": "Patient/add70d80-2f87-11e4-a02b-699a62c7658f",
            "display": "PAC-PATRU TESTPATRU X"
        },
        "onsetDate": "2007-01-03",
        "dateAsserted": "2007-01-03",
        "abatementDate": "2012-09-05",
        "code": {
            "coding": [{
                "code": "195967001",
                "system": "http://snomed.info/sct",
                "display": "Asthma"
            }],
            "text": "Asthma"
        }
    }
};

cases[2].result = {
    "problem": {
        "code": {
            "name": "Asthma",
            "code": "195967001",
            "code_system_name": "SNOMED CT"
        },
        "date_time": {
            "low": {
                "date": "2007-01-03T00:00:00.000Z",
                "precision": "day"
            },
            "high": {
                "date": "2012-09-05T00:00:00.000Z",
                "precision": "day"
            }
        }
    }
};
