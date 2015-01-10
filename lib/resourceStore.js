"use strict";

var proto = {
    addResource: function (resource) {
        var body = resource.body;
        var index = resource.type + '/' + resource.id;
        this.index[index] = body;
    },
    addResources: function (resources) {
        resources.forEach(this.addResource, this);
    },
    getReference: function (reference) {
        var result = this.index[reference];
        return result;
    }
};

exports.create = function () {
    var result = Object.create(proto);
    result.index = {};
    return result;
};
