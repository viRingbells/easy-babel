/**
 * Package.json
 **/
'use strict';

var debug = require('debug')('easy-babel');
var extend = require('extend');
var fs = require('fs');
var path = require('path');
var program = require('commander');
var version = require('./version');

function process(dir, to_dir) {
    debug('Package: fix package.json ' + dir);
    var pkg = {};
    if (fs.existsSync(path.join(dir, 'package.json'))) {
        pkg = require(path.join(dir, 'package.json'));
    }
    pkg.engines = pkg.engines || {};
    pkg.engines.node = '>=' + version();

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
        var run_easy_script = 'cd .easy && rm -rf node_modules && ln -s ../node_modules node_modules && ';
        pkg.easy.scripts = pkg.easy.scripts || extend(true, {}, pkg.scripts);
        for (var name in pkg.scripts) {
            var script = pkg.scripts[name];
            if (script.search(run_easy_script) !== 0) {
                pkg.easy.scripts[name] = pkg.scripts[name];
                pkg.scripts[name] = run_easy_script + pkg.scripts[name];
            }
        }
    }

    // store real binaries in pkg.easy.bin, and fix pkg.bin
    if (pkg.bin) {
        var bin_easy = '.easy';
        pkg.easy.bin = pkg.easy.bin || extend(true, {}, pkg.bin);
        for (var _name in pkg.bin) {
            var bin_ori = pkg.bin[_name];
            var bin = path.resolve(bin_ori);
            if (!path.isAbsolute(bin)) {
                bin = path.join(dir, bin);
            }
            var relativePath = path.relative(dir, bin);
            if (relativePath.slice(0, 2) === '..') {
                pkg.easy.bin[_name] = bin_ori;
                continue;
            }
            if (relativePath.slice(0, '.easy'.length) !== '.easy') {
                pkg.easy.bin[_name] = relativePath;
                relativePath = path.join('.easy', relativePath);
            }
            pkg.bin[_name] = relativePath;
        }
    }

    // prepare pkg_easy
    var pkg_easy = extend(true, {}, pkg);
    pkg_easy.main = pkg.easy.main;
    pkg_easy.scripts = pkg.easy.scripts;
    pkg_easy.bin = pkg.easy.bin;
    delete pkg_easy.easy;

    fs.writeFileSync(path.join(to_dir, 'package.json'), JSON.stringify(pkg_easy, null, 4));
    fs.writeFileSync(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 4));
}

module.exports = process;
debug('Package: loaded');