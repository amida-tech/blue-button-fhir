"use strict";

var _ = require('lodash');
var jsonave = require('@amida-tech/jsonave');
var value = require('./value');

var jp = jsonave.instance;

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
    status: 'Prescribed',
    'date_time.low': {
      value: value.datetime,
      dataKey: 'dateWritten',
      existsWhen: _.negate(_.partialRight(_.has, 'dosageInstruction[0].scheduledDateTime'))
    },
    'date_time.point': {
      value: value.datetime,
      dataKey: 'dateWritten',
      existsWhen: _.partialRight(_.has, 'dosageInstruction[0].scheduledDateTime')
    },
    'product.product': {
      value: value.concept,
      dataKey: jp('medication.reference.getResource().code.coding[0]')

    },
    'administration.site': {
      value: value.concept,
      dataKey: 'dosageInstruction[0].site.coding[0]'
    },
    'administration.route': {
      value: value.concept,
      dataKey: 'dosageInstruction[0].route.coding[0]'
    },
    'administration.dose.value': {
      dataKey: 'dosageInstruction[0].doseQuantity.value'
    },
    'administration.dose.unit': {
      dataKey: 'dosageInstruction[0].doseQuantity.units'
    },
    'administration.interval': {
      value: repeat,
      dataKey: 'dosageInstruction[0].scheduledTiming.repeat',
      existsWhen: _.negate(_.partialRight(_.has, 'dosageInstruction[0].scheduledTiming.repeat.when'))
    },
    'administration.interval.event': {
      value: value.codeToValueSet('scheduleWhen'),
      dataKey: 'dosageInstruction[0].scheduledTiming.repeat.when'
    },
    'precondition.value': {
      value: value.concept,
      dataKey: 'dosageInstruction[0].asNeededCodeableConcept.coding[0]'
    },
    'date_time.high': {
      value: value.datetime,
      dataKey: ['dosageInstruction[0].scheduledTiming.repeat.bounds.end', 'dosageInstruction[0].scheduledPeriod.end']
    },
    sig: {
      dataKey: 'text.div'
    }
  }
};
