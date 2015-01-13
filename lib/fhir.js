"use strict";

var engine = require('./engine');
var rootLogger = require('./logger');
var resourceStore = require('./resourceStore');

var condition = require('./resource/condition');
var allergyIntolerance = require('./resource/allergyIntolerance');
var observation_vital = require('./resource/observation-vital');

var logger = rootLogger.child({
    module: 'fhir'
});

var resourceToModel = exports.resourceToModel = function (store, resourceModel, resource) {
    var resourceDict = Object.create(store.index);
    var contained = resource.contained;
    if (contained) {
        contained.forEach(function (e) {
            var id = e.id;
            resourceDict['#' + id] = e;
        });
    }
    var runner = engine(resourceDict);
    var result = runner.run(resource, resourceModel.template);
    return result;
};

var resourceToModeller = {
    Condition: function() {
    	return condition;
    },
    AllergyIntolerance: function() {
    	return allergyIntolerance;
    },
    Observation: function(resource) {
    	var body = resource.body;
    	var isVital = body && body.extension && body.extension[0].valueCoding && (body.extension[0].valueCoding.code === '8716-3');
    	if (isVital) {
    		return body.related ? null : observation_vital;
    	}
    	return null;
    }
};

var entryResources = function(resources) {
	var indexDictionary = {};
	var preliminaryResult = resources.reduce(function(r, resource, index) {
    	var type = resource.type;
    	var fn = resourceToModeller[type];
    	if (fn) {
    		var rm = fn(resource, r, indexDictionary);
    		if (rm) {
    			r.push({
    				resource: resource,
    				modeller: rm
    			});
    			var id = type + '/' + resource.id;
    			indexDictionary[id] = index;
    		}
    	}
    	return r;
	}, []);
	return preliminaryResult;
};

exports.toModel = (function () {
    var addToSection = function (sectionName) {
        return function (data, value) {
            var section = data[sectionName] || (data[sectionName] = []);
            section.push(value);
        };
    };

    var modelUpdate = {
        problem: addToSection('problems'),
        allergy: addToSection('allergies'),
        vital: addToSection('vitals')
    };

    return function (resources) {
        var store = resourceStore.create();

        logger.trace('started toModel');
        store.addResources(resources);

        var fn = function (entryResource) {
        	if (entryResource) {
            	var modeller = entryResource.modeller;
            	var value = resourceToModel(store, modeller, entryResource.resource.body);
            	return {
            	    type: modeller.type,
            	    value: value
            	};
            } else {
            	return null;
            }
        };

        var ers = entryResources(resources);
        var results = ers.map(fn);
        var model = {
            meta: {},
            data: {}
        };
        results.forEach(function (result) {
            if (result) {
                var type = result.type;
                var f = modelUpdate[type];
                if (f) {
                    f(model.data, result.value);
                }
            }
        });
        return model;
    };
})();
