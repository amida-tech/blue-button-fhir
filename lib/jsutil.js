"use strict";

exports.deepValue = function (obj, propertyPath) {
    if (propertyPath) {
        var properties = propertyPath.split('.');
        properties.forEach(function (property) {
            obj = obj && obj[property];
        });
    }
    return obj === undefined ? null : obj;
};
