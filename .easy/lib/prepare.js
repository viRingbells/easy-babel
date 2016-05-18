/**
 * Prepare
 **/
'use strict';

var cwd = global.commands_cwd;
var debug = require('debug')('easy-babel');
var path = require('path');

/**
 * prepare targets, returns a list of absolute paths
 * If no args given, parse './'
 **/
exports.targets = function (targets) {
    debug('Prepare: prepare targets : ' + targets);
    if (!Array.isArray(targets)) {
        targets = [targets];
    }
    if (targets.length === 0) {
        debug('Prepare: args not given, use "./" instead');
        targets = ['./'];
    }
    debug('Prepare: making absolute path');
    var result = [];
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        if ('string' !== typeof target) {
            throw new Error('target should be a path');
        }
        if (!path.isAbsolute(target)) {
            target = path.join(cwd, target);
        }
        target = path.normalize(target);
        if (result.indexOf(target) < 0) {
            result.push(target);
        }
    }
    debug('Prepare: prepared targets are : ' + result);
    return result;
};

debug('Prepare: loaded');