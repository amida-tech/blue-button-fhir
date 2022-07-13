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

valueSets.scheduleWhen = {
  AC: "before meal",
  ACD: "before lunch",
  ACM: "before breakfast",
  ACV: "before dinner",
  C: "with meal",
  CD: "with lunch",
  CM: "with breakfast",
  CV: "with dinner",
  HS: "at bedtime",
  IC: "between meals",
  ICD: "between lunch and dinner",
  ICM: "between breakfast and lunch",
  ICV: "between dinner and bedtime",
  PC: "after meal",
  PCD: "after lunch",
  PCM: "after breakfast",
  PCV: "after dinner",
  WAKE: "upon waking"
};

valueSets.addressUse = {
  home: 'home address',
  work: 'work place',
  temp: 'temporary',
  old: 'bad address'
};

valueSets.phoneUse = {
  home: 'primary home',
  work: 'work place',
  mobile: 'mobile contact'
};

valueSets.gender = {
  'female': 'Female',
  'male': 'Male',
  'other': 'Undifferentiated',
  'unknown': 'Undifferentiated'
};
