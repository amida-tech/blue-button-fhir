"use strict";

var valueSets = module.exports = {};

valueSets.criticality = {
    fatal: {
        name: 'Fatal',
        code: '399166001',
        code_system_name: 'SNOMED CT'
    },
    high: {
        name: 'Severe',
        code: '24484000',
        code_system_name: 'SNOMED CT'
    },
    medium: {
        name: 'Moderate',
        code: '6736007',
        code_system_name: 'SNOMED CT'
    },
    low: {
        name: 'Mild',
        code: '255604002',
        code_system_name: 'SNOMED CT'
    }
};

valueSets.reactionSeverity = {
    severe: {
        name: 'Fatal',
        code: '399166001',
        code_system_name: 'SNOMED CT'
    },
    serious: {
        name: 'Severe',
        code: '24484000',
        code_system_name: 'SNOMED CT'
    },
    moderate: {
        name: 'Moderate',
        code: '6736007',
        code_system_name: 'SNOMED CT'
    },
    minor: {
        name: 'Mild',
        code: '255604002',
        code_system_name: 'SNOMED CT'
    }
};

valueSets.sensitivityStatus = {
    suspected: {
        name: 'Active',
        code: '55561003',
        code_system_name: 'SNOMED CT'
    },
    confirmed: {
        name: 'Active',
        code: '55561003',
        code_system_name: 'SNOMED CT'
    },
    refuted: {
        name: 'Resolved',
        code: '413322009',
        code_system_name: 'SNOMED CT'
    },
    resolved: {
        name: 'Resolved',
        code: '413322009',
        code_system_name: 'SNOMED CT'
    }
};

valueSets.observationStatus = {
    'preliminary': 'active',
    'final': 'completed',
    'canceled': 'canceled'
};
