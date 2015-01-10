"use strict";

var proto = {
    addResource: function (resource) {
        var index = resource.type + '/' + resource.id;
        this.index[index] = resource;
    },
    addResources: function (resources) {
        resources.forEach(this.addResource, this);
    },
    getReference: function (reference, callback) {
        var result = this.index[reference];
        if (callback) {
            callback(null, result);
        }
        return result;
    }
};

exports.create = function (patientRef, baseFhirUrl, log) {
    var result = Object.create(proto);
    result.index = {};
    return result;
};
