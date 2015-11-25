/**
 * Parse the targets with babel
 **/
'use strict';

const cp = require('child_process');
const chalk = require('chalk');
const debug = require('debug')('easy-babel');
const extend = require('extend');
const fs = require('fs');
const mkdirp = require('mkdirp').sync;
const path = require('path');
const program = require('commander');
const testv = require('test-version');
const cwd = process.cwd();
//const bwd     = path.join(__dirname, '..');
const bwd = process.cwd();

const extnames = ['.js', '.jsx', '.es6'];
const babelpath = path.join(__dirname, '../node_modules/.bin/babel');

let VERSION;

/**
 * Parse targets with babel.
 * @param  {string|Array} targets
 * @return {undefined}    no return
 **/
function parse(targets) {
    debug('Parse: start parsing');
    targets = prepare_targets(targets);
    prepare_babelrc();
    parse_targets(targets);
}

/**
 * prepare targets, returns a list of absolute paths
 * If no args given, parse './'
 **/
function prepare_targets(targets) {
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
function prepare_babelrc() {
    debug('Parse: prepare babelrc');
    const version = adapt_version();
    const babelrc_filename = path.join(__dirname, '../babelrc/babel_v' + version);
    copy_babelrc(babelrc_filename);
}

/**
 * cp babelrc
 **/
function copy_babelrc(filename) {
    debug('Parse: use ' + filename);
    cp.execSync('cp ' + filename + ' ' + path.join(bwd, '.babelrc'));
    process.on('exit', code => {
        debug('Parse: clear .babelrc');
        cp.execSync('rm ' + path.join(bwd, '.babelrc'));
    });
}

/**
 * return a node version that target version is compatible with
 **/
const versions = ["5.0.0", "4.0.0", "3.0.0", "2.0.0", "1.0.0", "0.11.0"];
function adapt_version() {
    debug('Parse: match version');
    const target_version = program.nodeversion || process.version;
    debug('Parse: target version is ' + target_version);
    for (let i = 0; i < versions.length; i++) {
        let version = versions[i];
        if (testv(target_version, ">=" + version)) {
            debug('Parse: versioin adapted is ' + version);
            VERSION = version;
            return version;
        }
    }
    debug('Parse: version not supported');
    throw new Error('Target version ' + target_version + ' is not supported!');
}

const specail_target_list = ['node_modules', 'package.json', '.easy'];
function is_special(filename) {
    if (filename[0] === '.' || specail_target_list.indexOf(filename) >= 0) {
        return true;
    }
    return false;
}

/**
 * parse the target
 **/
function parse_targets(targets) {
    debug('Parse: parse targets');
    for (let i = 0; i < targets.length; i++) {
        const target = targets[i];
        const name = path.basename(target);
        if (is_special(name)) {
            special_targets.push(target);
            continue;
        }
        parse_target(target);
    }
}

function parse_target(target) {
    debug('Parse: parse target ' + target);
    const isDirectory = fs.statSync(target).isDirectory();
    const filename = path.basename(target);
    const target_dir = isDirectory ? target : path.dirname(target);
    const easy_dir = path.join(target_dir, '.easy');
    debug('Parse: easy diretory is ' + easy_dir);
    cp.execSync('rm -rf ' + easy_dir);
    mkdirp(easy_dir);
    const to = isDirectory ? easy_dir : path.join(easy_dir, filename);
    if (isDirectory) {
        babel_dir(target, to);
    } else {
        babel_file(target, to);
    }
    console.log('  ' + chalk.cyan('Parse done') + ': ' + chalk.yellow(target) + chalk.cyan(' ===> ') + chalk.yellow(to));
}

function babel_file(from, to) {
    const filename = path.basename(from);
    if (is_special(filename) || extnames.indexOf(path.extname(from)) < 0) {
        return;
    }
    debug('Parse: babel ' + from + ' -o ' + to);
    cp.execSync('cp ' + from + ' ' + to);
    process.chdir(bwd);
    cp.execSync(babelpath + ' ' + from + ' -o ' + to);
}

function babel_dir(dir, to_dir) {
    debug('Parse: babel dir ' + dir);
    fs.readdirSync(dir).forEach(filename => {
        if (is_special(filename)) {
            return;
        }
        let from = path.join(dir, filename);
        let to = path.join(to_dir, filename);
        if (fs.statSync(from).isDirectory()) {
            debug('Parse: babel dir ' + from + ' ==> ' + to);
            cp.execSync('cp -r ' + from + ' ' + to);
            process.chdir(bwd);
            cp.execSync(babelpath + ' ' + from + ' -d ' + to);
        } else {
            babel_file(from, to);
        }
    });
    debug('Parse: fix package.json');
    let pkg = {};
    if (fs.existsSync(path.join(dir, 'package.json'))) {
        pkg = require(path.join(dir, 'package.json'));
    }
    pkg.engines = pkg.engines || {};
    pkg.engines.node = '>=' + VERSION;
    if (pkg.main_easy && !pkg.main) {
        throw new Error("Invalid package.json, missing main, or should remove main_easy");
    }
    pkg.main = pkg.main_easy || pkg.main || 'index';
    let pkg_easy = extend(true, {}, pkg);
    delete pkg_easy.main_easy;
    fs.writeFileSync(path.join(to_dir, 'package.json'), JSON.stringify(pkg_easy, null, 4));
    pkg.main_easy = pkg.main_easy || pkg.main;
    pkg.main = '.easy';
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 4));
}

module.exports = parse;
debug('Parse: loaded');