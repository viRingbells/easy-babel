/**
 * Get parse target version
 **/
'use strict'

const debug   = require('debug')('easy-babel');
const program = require('commander');
const testv   = require('test-version');

let VERSION = null;

/**
 * find a node version that target version is compatible with
 **/
const versions = ["5.0.0", "4.0.0", "3.0.0", "2.0.0", "1.0.0", "0.11.0"];
function adapt_version () {
    debug('Version: adapt version');
    const target_version = program.nodeversion || process.version;
    debug('Version: target version is ' + target_version);
    for (let i = 0; i < versions.length; i++) {
        let version = versions[i];
        if (testv(target_version, ">=" + version)) {
            debug('Version: versioin adapted is ' + version);
            VERSION = version;
            return VERSION;
        }
    }
    debug('Version: version not supported');
    throw new Error('Target version ' + target_version + ' is not supported!');
}

function get_version () {
    debug('Version: get version');
    const v = VERSION || adapt_version();
    debug('Version: version is ' + v);
    return v;
}

module.exports = get_version;
debug('Version: loaded');
