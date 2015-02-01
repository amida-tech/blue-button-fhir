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
    getReference: function (reference, withBody) {
        var result = this.index[reference];
        if (withBody) {
            var idPieces = reference.split('/');
            return {
                type: idPieces[0],
                id: idPieces[1],
                body: result
            };
        } else {
            return result;
        }
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
