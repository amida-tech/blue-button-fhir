"use strict";

var proto = {
    addResource: function (resource) {
        var content = resource.content;
        var index = resource.id;
        this.index[index] = content;
    },
    addResources: function (resources) {
        resources.forEach(this.addResource, this);
    }
};

exports.create = function (resources) {
    var result = Object.create(proto);
    result.index = {};
    if (resources) {
        result.addResources(resources);
    }
    return result;
};
