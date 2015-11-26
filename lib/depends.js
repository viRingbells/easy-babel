/**
 * Parse dependencies
 **/
'use strict';

const debug   = require('debug')('easy-babel');
const chalk   = require('chalk');
const fs      = require('fs');
const path    = require('path');
const testv   = require('test-veresion');
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

function directories (filename) {
    return fs.statSync(filename).isDirectory();
}

function parse_node_module (dirname) {
    debug('Depends: parse node_module of ' + dirname);
    const node_module_path = path.join(dirname, 'node_modules');
    fs.readdirSync(node_module_path).filter(directories).forEach(module_path => {
        if (module_path[0] === '.') return;
        let pkg;
        try {
            pkg = require(path.join(module_path, 'package.json'));        
        }
        catch (e) {
            console.warn(chalk.cyan('  Fail to load package.json in ') + chalk.red(module_path) + ' ' + chalk.cyan('skip...'));
        }
        if (!pkg || !pkg.engines || !pkg.engines.node || testv(version(), pkg.engines.node)) {
            debug('Depends: engine fullfills demand of ' + module_path + ' skip...');
            return;
        }
        debug('Depends: parse ' + module_path);
        parse(module_path);
    });
}

debug('Depends: loaded');
