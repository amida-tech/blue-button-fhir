"use strict";

var _ = require('lodash');
var jsonave = require('@amida-tech/jsonave');
var value = require('./value');

var jp = jsonave.instance;

var effectiveTime = {
  content: {
    low: {
      value: value.date,
      dataKey: 'effectivePeriod.start'
    },
    high: {
      value: value.date,
      dataKey: 'effectivePeriod.end'
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
      template: quantity,
      dataKey: 'quantity'
    }
  }
};

var repeatPeriod = {
  content: {
    'period.value': {
      dataKey: 'period'
    },
    'period.unit': {
      dataKey: 'periodUnits'
    },
    frequency: false
  },
  existsWhen: _.partialRight(_.has, 'period')
};

var repeatDuration = {
  content: {
    'period.value': {
      dataKey: 'duration'
    },
    'period.unit': {
      dataKey: 'durationUnits'
    },
    frequency: true
  },
  existsWhen: [_.partialRight(_.has, 'duration'), _.negate(_.partialRight(_.has, 'period'))]
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
  },
  existsWhen: _.partialRight(_.has, 'period')
};

exports.template = {
  type: 'medication',
  content: {
    status: {
      value: function (input) {
        return input === 'completed' ? 'Completed' : 'Prescribed';
      },
      dataKey: 'status'
    },
    date_time: {
      template: effectiveTime
    },
    'product.product': {
      value: value.concept,
      dataKey: jp('medication.reference.getResource().code.coding[0]'),
    },
    administration: {
      template: dosage,
      dataKey: 'dosage[0]'
    },
    'precondition.value': {
      value: value.concept,
      dataKey: 'dosage[0].asNeededCodeableConcept.coding[0]'
    },
    'administration.interval': {
      assign: [repeatPeriod, repeatDuration],
      dataKey: 'dosage[0].schedule.repeat',
      existsWhen: _.negate(_.partialRight(_.has, 'dosage[0].schedule.repeat.when'))
    },
    'administration.interval.event': {
      value: value.codeToValueSet('scheduleWhen'),
      dataKey: 'dosage[0].schedule.repeat.when'
    },
    'sig': {
      dataKey: jp('medication.reference.getResource().code.coding[0].display')
    }
  }
};
