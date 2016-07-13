'use strict';

var argv = require('yargs').argv;
var os = require('os');
var exports = module.exports

module.exports.os = function() {
    switch (os.platform()) {
        case 'darwin':
            return 'osx';
        case 'linux':
            return 'linux';
        case 'win32':
            return 'windows';
    }
    return 'unsupported';
};

module.exports.replace = function(str, patterns) {
    Object.keys(patterns).forEach(function(pattern) {
        var matcher = new RegExp('{{' + pattern + '}}', 'g');
        str = str.replace(matcher, patterns[pattern]);
    });
    return str;
};

module.exports.convertToRtf = function(plain) {
    plain = plain.replace(/\n/g, "\\par\n");
    return "{\\rtf1\\ansi\\ansicpg1252\\deff0\\deflang2057{\\fonttbl{\\f0\\fnil\\fcharset0 Microsoft Sans Serif;}}\n\\viewkind4\\uc1\\pard\\f0\\fs17 " + plain + "\\par\n}";
};

module.exports.getEnvName = function() {
    return argv.env || 'development';
};

module.exports.getSigningId = function() {
    return argv.sign;
};

module.exports.getCert = function() {
    return argv.cert;
};

// Fixes https://github.com/nodejs/node-v0.x-archive/issues/2318
module.exports.spawnablePath = function(path) {
    if (process.platform === 'win32') {
        return path + '.cmd';
    }
    return path;
};

module.exports.finalPackageName = function (manifest, extention) {
    var name = manifest.name
    var version = manifest.version
    return name +
      (exports.getEnvName() === 'staging' ? '-staging_' : '_') +
      version + '.' + extention
};
