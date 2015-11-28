/**
 * Parse dependencies
 **/
'use strict';

const debug   = require('debug')('easy-babel');
const chalk   = require('chalk');
const fs      = require('fs');
const Module  = require('module');
const path    = require('path');
const testv   = require('test-version');
const parse   = require('./parse');
const prepare = require('./prepare');
const version = require('./version');

/**
 * Parse all dependencies
 **/
function depends (targets) {
    debug('Depends: start parse dependencies');
    targets = prepare.targets(targets).filter(directories);
    debug('Depends: target : ' + targets);
    targets.forEach(parse_node_module);
}

function directories (parentdir) {
    parentdir = parentdir || '.';
    return filename => {
        return fs.statSync(path.join(parentdir,filename)).isDirectory();
    }
}

function loadPkg (dirname) {
    let pkg;
    try {
        pkg = require(path.join(dirname, 'package.json'));
    }
    catch (e) {
        if (process.env.NODE_ENV !== 'testing') {
            console.warn(chalk.cyan('  Fail to load package.json in ') + chalk.red(dirname) + chalk.cyan(' message: ' + e.message));
        }
    }
    return pkg;
}

function parse_node_module (dirname) {
    debug('Depends: parse node_module of ' + dirname);
    const pkg = loadPkg(dirname);
    if (!pkg) {
        parse_node_module_by_dir(path.join(dirname, 'node_modules'));
    }
    else {
        parse_node_module_by_pkg(pkg, dirname);
    }
}

function parse_node_module_by_pkg (pkg, dirname) {
    debug('Depends: parse by pkg ');
    for (const module_name in pkg.dependencies || {}) {
        const module_path = find_module_path(module_name, dirname);
        parse_module(module_path);
    }
}

function find_module_path (module_name, dirname) {
    debug('Depends: find module path of ' + module_name);
    const paths = Module._nodeModulePaths(dirname);
    for (let i = 0; i < paths.length; i++) {
        const _path = path.join(paths[i], module_name);
        if (fs.existsSync(_path) && fs.statSync(_path).isDirectory()) {
            return _path;
        }
    }
    if (process.env.NODE_ENV !== 'testing') {
        console.warn(chalk.cyan('module ') + chalk.yellow(module_name) + chalk.cyan(' not found, skip'));
    }
    return null;
}

function parse_node_module_by_dir (node_module_path) {
    debug('Depends: parse by dir ' + node_module_path);
    fs.readdirSync(node_module_path)
        .filter(directories(node_module_path))
        .forEach(dirname => {
            parse_module(path.join(node_module_path, dirname));
        });
 }

function parse_module (module_path) { 
    if (!path.isAbsolute(module_path)) {
        if (process.env.NODE_ENV !== 'testing') {
            console.warn(chalk.cyan('  ') + chalk.red(module_path) + ' ' + chalk.cyan(' is not a directory skip...'));
        } 
        return;
    }
    const module_dirname = path.basename(module_path);
    if (module_dirname[0] === '.') return;
    let pkg;
    try {
        pkg = require(path.join(module_path, 'package.json'));        
    }
    catch (e) {
        if (process.env.NODE_ENV !== 'testing') {
            console.warn(chalk.cyan('  Fail to load package.json in ') + chalk.red(module_path) + ' ' + chalk.cyan('message is ' + e.message + ' skip...'));
        }
        return;
    }
    if (!pkg || !pkg.engines || !pkg.engines.node || testv(version(), pkg.engines.node)) {
        debug('Depends: engine fullfills demand of ' + module_path + ' skip...');
        return;
    }
    debug('Depends: parse ' + module_path);
    parse(module_path);
    depends(module_path);
}

module.exports = depends;
debug('Depends: loaded');
