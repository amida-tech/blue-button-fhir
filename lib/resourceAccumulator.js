"use strict";

var resourceAccumulatorProto = {
    add: function (resource, callback) {
        var id = resource.type + '/' + resource.id;
        this.resources[id] = resource;
        callback(null);
    },
    get: function (id, callback) {
        var result = this.resources[id];
        if ((!result) && this.resourceServer) {
            this.resourceServer.findResource(id, callback);
        } else {
            callback(null, result);
        }
    }
};

exports.create = function (options) {
    var result = Object.create(resourceAccumulatorProto);
    result.resources = [];
    result.resourceServer = options.resourceServer;
    return result;
};
