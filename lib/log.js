"use strict";

var fs = require('fs');
var path = require('path');

var bunyan = require('bunyan');

var config = {
    level: 'trace', // logging.level possible values: fatal, error, warn, info, debug, trace
    logFolder: './logs',
    filename: 'app.log',
    logRequests: true,
    period: '1d', // one of "h"(hours), "d"(days), "w"(weeks), "m"(months), "y"(years)
    count: 10 // number of rotated files to keep
};

var log = bunyan.createLogger({
    name: "blue-button-fhir",
    streams: [{
        type: 'rotating-file',
        level: config.level,
        path: path.join(config.logFolder, config.filename),
        period: config.period,
        count: config.count
    }]
});

if (!fs.existsSync(config.logFolder)) {
    fs.mkdirSync(config.logFolder);
}

exports.child = (function () {
    var cid = 0;

    return function (entry) {
        ++cid;
        return log.child({
            cid: cid,
            centry: entry
        });
    };
})();
