/**
 * Parse the targets with babel
 **/
'use strict';

const cp      = require('child_process');
const debug   = require('debug')('easy-babel');
const fs      = require('fs');
const mkdirp  = require('mkdirp').sync;
const path    = require('path');
const program = require('commander');
const testv   = require('test-version');
const cwd     = process.cwd();

const babelpath = path.join(__dirname, '../node_modules/.bin/babel');

/**
 * Parse targets with babel.
 * @param  {string|Array} targets
 * @return {undefined}    no return
 **/
function parse (targets) {
    debug('Parse: start parsing');
    targets = prepare_targets(targets);
    prepare_babelrc();
    parse_targets(targets);
}

/**
 * switch to dir /tmp for some temp files
 * @param  {undefined}   no input
 * @return {undefined}   no return
 **/
function prepare_tmp () {
    debug('Parse: prepare tmp');
    mkdirp('/tmp');
}

/**
 * prepare targets, returns a list of absolute paths
 * If no args given, parse './'
 **/
function prepare_targets (targets) {
    debug('Parse: prepare targets : ' + targets);
    if (!Array.isArray(targets)) {
        targets = [targets];
    }
    if (targets.length === 0) {
        debug('Parse: args not given, use "./" instead');
        targets = ['./'];
    }
    debug('Parse: making absolute path');
    const result = [];
    for (let i = 0; i < targets.length; i++) {
        let target = targets[i];
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
    debug('Parse: prepared targets are : ' + result);
    return result;
}

/**
 * prepare babelrc
 **/
function prepare_babelrc () {
    debug('Parse: prepare babelrc');
    const version = adapt_version();
    const babelrc_filename = path.join(__dirname, '../babelrc/babel_v' + version);
    prepare_tmp();
    copy_babelrc(babelrc_filename);
}

/**
 * cp babelrc
 **/
function copy_babelrc (filename) {
    debug('Parse: use ' + filename);
    cp.execSync('cp ' + filename + ' /tmp/.babelrc');
}

/**
 * return a node version that target version is compatible with
 **/
const versions = ["5.0.0", "4.0.0", "3.0.0", "2.0.0", "1.0.0", "0.11.0"];
function adapt_version () {
    debug('Parse: match version');
    const target_version = program.nodeversion || process.version;
    debug('Parse: target version is ' + target_version);
    for (let i = 0; i < versions.length; i++) {
        let version = versions[i];
        if (testv(target_version, ">=" + version)) {
            debug('Parse: versioin adapted is ' + version);
            return version;
        }
    }
    debug('Parse: version not supported');
    throw new Error('Target version ' + target_version + ' is not supported!');
}

/**
 * parse the target
 **/
const specail_target_list = ['node_modules', 'package.json', '.easy'];
function parse_targets (targets) {
    debug('Parse: parse targets');
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const name   = path.basename(target);
        if (specail_target_list.indexOf(name) >= 0) {
            continue;
        }
        parse_target(target);
    }
    debug('Parse: handle special targets');
}

function parse_target (target) {
    debug('Parse: parse target ' + target);
    const isDirectory = fs.statSync(target).isDirectory();
    const filename = path.basename(target);
    const target_dir = isDirectory ? target : path.dirname(target);
    const easy_dir = path.join(target_dir, '.easy');
    debug('Parse: easy diretory is ' + easy_dir);
    cp.execSync('rm -rf ' +  easy_dir);
    mkdirp(easy_dir);
    cp.execSync('cd /tmp');
    const destination = isDirectory ? easy_dir : path.join(easy_dir, filename);
    console.log(target, destination);
}

module.exports = parse;
debug('Parse: loaded');
