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
const prepare = require('./prepare');
const process_pkg = require('./package');
const version = require('./version');
const cwd = process.cwd();
//const bwd     = path.join(__dirname, '..');
const bwd = process.cwd();

const extnames = ['.js', '.jsx', '.es6'];
const babelpath = path.join(path.dirname(require.resolve('babel-cli')), '../.bin/babel');

/**
 * Parse targets with babel.
 * @param  {string|Array} targets
 * @return {undefined}    no return
 **/
function parse(targets) {
    debug('Parse: start parsing');
    targets = prepare.targets(targets);
    prepare_babelrc();
    parse_targets(targets);
}

/**
 * prepare babelrc
 **/
function prepare_babelrc() {
    debug('Parse: prepare babelrc');
    const babelrc_filename = path.join(__dirname, '../babelrc/babel_v' + version());
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
        cp.execSync('rm -f ' + path.join(bwd, '.babelrc'));
    });
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
    process_pkg(dir, to_dir);
}

module.exports = parse;
debug('Parse: loaded');