"use strict";

var bbu = require("blue-button-util");
var request = require('request');

var proto = {
    getResources: function () {
        return this.resources;
    },
    getSubject: function () {
        return this.subject;
    },
    addResource: function (resource) {
        this.resources.push(resource);
        var index = resource.type + '/' + resource.id;
        this.index[index] = resource;
    },
    addResources: function (resources) {
        resources.forEach(this.addResource, this);
    },
    removeResource: function (id) {
        var removedResources = bbu.remove(this.resources, function (resource) {
            return resource.id === id;
        });
        removedResources.forEach(function (resource) {
            var index = resource.type + '/' + resource.id;
            delete this.index[index];
        });
    },
    getResource: function (type, id) {
        var index = type + '/' + id;
        var result = this.index[index];
        return result;
    },
    getReference: function (reference, callback) {
        var result = this.index[reference];
        if (result) {
            if (callback) {
                callback(null, result);
            }
            return result;
        } else {
            var pieces = reference.split('/');
            this.findResource(pieces[0], {}, callback);
        }
    },
    findResource: function (resourceType, query, callback) {
        this.log.debug({
            query: query
        }, 'Retrieving ' + resourceType + ' resources from external service... ');
        request({
            uri: this.baseFhirUrl + resourceType,
            qs: query,
            method: "GET"
        }, function (err, resp, body) {
            if (err) {
                callback(err);
            } else if (resp.statusCode !== 200) {
                callback(new Error('Error retrieving Concept: ' + resp.statusCode));
            } else {
                var result = JSON.parse(body);
                callback(null, result);
            }
        });
    }
};

exports.create = function (patientRef, baseFhirUrl, log) {
    var result = Object.create(proto);
    result.subject = patientRef;
    result.baseFhirUrl = baseFhirUrl;
    result.resources = [];
    result.index = {};
    result.log = log;
    return result;
};
