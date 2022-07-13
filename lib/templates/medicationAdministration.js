"use strict";

var jsonave = require('@amida-tech/jsonave');
var value = require('./value');

var jp = jsonave.instance;

var effectiveTime = {
  content: {
    low: {
      value: value.date,
      dataKey: 'effectiveTimePeriod.start'
    },
    high: {
      value: value.date,
      dataKey: 'effectiveTimePeriod.end'
    },
    point: {
      value: value.date,
      dataKey: 'effectiveTimeDateTime'
    }
  }
};

var quantity = {
  content: {
    value: {
      dataKey: 'value'
    },
    unit: {
      dataKey: 'units'
    }
  }
};

var dosage = {
  content: {
    route: {
      value: value.concept,
      dataKey: 'route.coding[0]'
    },
    site: {
      value: value.concept,
      dataKey: 'site.coding[0]',
    },
    dose: {
      value: quantity,
      dataKey: 'quantity'
    }
  }
};

var repeat = {
  content: {
    'period.value': {
      dataKey: 'duration'
    },
    'period.unit': {
      dataKey: 'durationUnits'
    },
    frequency: true
  }
};

exports.template = {
  type: 'medication',
  content: {
    date_time: {
      value: effectiveTime
    },
    status: 'Completed',
    administration: {
      value: dosage,
      dataKey: 'dosage'
    },
    'precondition.value': {
      value: value.concept,
      dataKey: jp('prescription.reference.getResource().dosageInstruction[0].asNeededCodeableConcept.coding[0]')
    },
    'product.product': {
      value: value.concept,
      dataKey: jp('medication.reference.getResource().code.coding[0]'),
    },
    'administration.interval': {
      value: repeat,
      dataKey: jp('prescription.reference.getResource().dosageInstruction[0].scheduledTiming.repeat'),
    },
    'sig': {
      dataKey: jp('prescription.reference.getResource().text.div')
    }
  }
};
