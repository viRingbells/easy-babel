/**
 * Package.json
 **/
'use strict';

const debug   = require('debug')('easy-babel');
const extend  = require('extend');
const fs      = require('fs');
const path    = require('path');
const program = require('commander');
//const version = require('./version');

function process (dir, to_dir) {
    debug('Package: fix package.json ' + dir);
    let pkg = {};
    if (fs.existsSync(path.join(dir, 'package.json'))) {
        pkg = require(path.join(dir, 'package.json'));
    }
    pkg.engines = pkg.engines || {};
//    pkg.engines.node = '>=' + version();
    pkg.engines.node = '>=' + program.nodeversion;

    pkg.easy = pkg.easy || {};

    // store real main in pkg.easy.main and fix pkg.main
    if (pkg.main !== '.easy') {
        pkg.easy.main = pkg.main;
        pkg.main = '.easy';
    }
    if (!pkg.easy.main) {
        pkg.easy.main = 'index';
    }

    // store real scripts in pkg.easy.scripts, and fix pkg.scripts
    if (pkg.scripts) {
        const run_easy_script = 'cd .easy && rm -rf node_modules && ln -s ../node_modules node_modules && ';
        pkg.easy.scripts = pkg.easy.scripts || extend(true, {}, pkg.scripts);
        // pkg.easy.scripts = pkg.easy.scripts || pkg.scripts;
        for (let name in pkg.scripts) {
            const script = pkg.scripts[name];
            if (script.slice(0, run_easy_script.length) !== run_easy_script) {
                pkg.easy.scripts[name] = pkg.scripts[name];
                pkg.scripts[name] = run_easy_script + pkg.scripts[name];
            }
        }
    }

    // store real binaries in pkg.easy.bin, and fix pkg.bin
    if (pkg.bin) {
        const bin_easy = '.easy';
        pkg.easy.bin = pkg.easy.bin || extend(true, {}, pkg.bin);
        for (let name in pkg.bin) {
            const bin_ori = pkg.bin[name];
            let bin = path.resolve(bin_ori);
            if (!path.isAbsolute(bin)) {
                bin = path.join(dir, bin);
            }
            let relativePath = path.relative(dir, bin);
            if (relativePath.slice(0,2) === '..') {
                pkg.easy.bin[name] = bin_ori;
                continue;
            }
            if (relativePath.slice(0, '.easy'.length) !== '.easy') {
                pkg.easy.bin[name] = relativePath;
                relativePath = path.join('.easy', relativePath);
            }
            pkg.bin[name] = relativePath;
        }
    }

    // prepare pkg_easy
    let pkg_easy = extend(true, {}, pkg);
    pkg_easy.main = pkg.easy.main
    pkg_easy.scripts = pkg.easy.scripts;
    pkg_easy.bin = pkg.easy.bin;
    delete pkg_easy.easy;

    fs.writeFileSync(path.join(to_dir, 'package.json'), JSON.stringify(pkg_easy, null, 4));
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 4));
}

module.exports = process;
debug('Package: loaded');
