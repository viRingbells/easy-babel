/**
 * Parse the targets with babel
 **/
'use strict';

var cp = require('child_process');
var chalk = require('chalk');
var debug = require('debug')('easy-babel');
var extend = require('extend');
var fs = require('fs');
var mkdirp = require('mkdirp').sync;
var path = require('path');
var program = require('commander');
var prepare = require('./prepare');
var process_pkg = require('./package');
var version = require('./version');
var cwd = process.cwd();
//const bwd     = path.join(__dirname, '..');
var bwd = process.cwd();

var extnames = ['.js', '.jsx', '.es6'];
var babelpath = path.join(path.dirname(require.resolve('babel-cli')), '../.bin/babel');

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
    var filename = path.join(__dirname, '../babelrc/babelrc_v' + version());
    debug('Parse: use ' + filename);
    var to = path.join(bwd, '.babelrc');
    var content = prepare_babelrc_content(filename);
    fs.writeFileSync(to, JSON.stringify(content, null, 4));
    //cp.execSync('cp ' + filename + ' ' + path.join(bwd, '.babelrc'));
    process.on('exit', function (code) {
        debug('Parse: clear .babelrc ' + to);
        cp.execSync('rm -f ' + to);
    });
}

function prepare_babelrc_content(filename, options) {
    debug("Parse: parsing " + filename);
    options = options || {};
    options.except = Array.isArray(options.except) ? options.except : [options.except];
    var content = JSON.parse(fs.readFileSync(filename));
    var plugins = content.plugins;
    if (!Array.isArray(plugins)) {
        debug("Parse: plugins not array, return directly");
        return content;
    }
    var use = [];
    plugins = plugins.filter(function (item) {
        var name = item;
        if (Array.isArray(item)) {
            name = item[0];
        }
        if (options.except.indexOf(name) >= 0) {
            return false;
        }
        if (name.match(/^babelrc_v/)) {
            use.push(item);
            return false;
        }
        return true;
    });
    use.forEach(function (item) {
        if (!Array.isArray(item)) {
            item = [item];
        }
        var name = item[0];
        var options = item[1];
        debug("Parse: use " + name);
        var content = prepare_babelrc_content(path.join(path.dirname(filename), name), options);
        plugins = plugins.concat(content.plugins);
    });
    content.plugins = plugins;
    return content;
}

var specail_target_list = ['node_modules', 'package.json', '.easy'];
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
    for (var i = 0; i < targets.length; i++) {
        var target = targets[i];
        var name = path.basename(target);
        if (is_special(name)) {
            special_targets.push(target);
            continue;
        }
        parse_target(target);
    }
}

function parse_target(target) {
    debug('Parse: parse target ' + target);
    var isDirectory = fs.statSync(target).isDirectory();
    var filename = path.basename(target);
    var target_dir = isDirectory ? target : path.dirname(target);
    var easy_dir = path.join(target_dir, '.easy');
    debug('Parse: easy diretory is ' + easy_dir);
    cp.execSync('rm -rf ' + easy_dir);
    mkdirp(easy_dir);
    var to = isDirectory ? easy_dir : path.join(easy_dir, filename);
    if (isDirectory) {
        babel_dir(target, to);
    } else {
        babel_file(target, to);
    }
    console.log('  ' + chalk.cyan('Parse done') + ': ' + chalk.yellow(target) + chalk.cyan(' ===> ') + chalk.yellow(to));
}

function babel_file(from, to) {
    cp.execSync('cp ' + from + ' ' + to);
    var filename = path.basename(from);
    if (is_special(filename) || extnames.indexOf(path.extname(from)) < 0) {
        return;
    }
    debug('Parse: babel ' + from + ' -o ' + to);
    process.chdir(bwd);
    cp.execSync(babelpath + ' ' + from + ' -o ' + to);
}

function babel_dir(dir, to_dir) {
    debug('Parse: babel dir ' + dir);
    fs.readdirSync(dir).forEach(function (filename) {
        if (is_special(filename)) {
            return;
        }
        var from = path.join(dir, filename);
        var to = path.join(to_dir, filename);
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