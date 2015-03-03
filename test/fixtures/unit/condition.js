"use strict";

var cases = module.exports = [];

cases.template = require('../../../lib/resource/condition');
cases.type = 'problem';

var na = null;

cases[0] = {};

cases[0].resources = [{
    "type": "Condition",
    "id": "c-0-0",
    "content": {
        "resourceType": "Condition",
        "status": "confirmed",
        "subject": na,
        "onsetDate": "2012-08-05",
        "dateAsserted": "2012-08-05",
        "abatementBoolean": true,
        "code": {
            "coding": [{
                "code": "233604007",
                "system": "http://snomed.info/sct",
                "display": "Pneumonia"
            }],
            "text": na
        }
    }
}];

cases[0].input = cases[0].resources[0];

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

cases[1].resources = [{
    "type": "Condition",
    "id": "c-1-0",
    "content": {
        "resourceType": "Condition",
        "status": "confirmed",
        "subject": na,
        "onsetDate": "2007-01-03",
        "dateAsserted": "2007-01-03",
        "code": {
            "coding": [{
                "code": "195967001",
                "system": "http://snomed.info/sct",
                "display": "Asthma"
            }],
            "text": na
        }
    }
}];

cases[1].input = cases[1].resources[0];

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

cases[2].resources = [{
    "type": "Condition",
    "id": "c-2-0",
    "content": {
        "resourceType": "Condition",
        "status": "confirmed",
        "subject": na,
        "onsetDate": "2007-01-03",
        "dateAsserted": "2007-01-03",
        "abatementDate": "2012-09-05",
        "code": {
            "coding": [{
                "code": "195967001",
                "system": "http://snomed.info/sct",
                "display": "Asthma"
            }],
            "text": na
        }
    }
}];

cases[2].input = cases[2].resources[0];

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
