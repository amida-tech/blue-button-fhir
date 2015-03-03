"use strict";

var proto = {
    addBundleEntry: function (bundleEntry) {
        var content = bundleEntry.content;
        var id = bundleEntry.id;
        this.index[id] = content;
    },
    addBundleEntries: function (bundleEntries) {
        bundleEntries.forEach(this.addBundleEntry, this);
    },
    getIndex: function () {
        return this.index;
    }
};

exports.create = function (bundleEntries) {
    var result = Object.create(proto);
    result.index = {};
    if (bundleEntries) {
        result.addBundleEntries(bundleEntries);
    }
    return result;
};
