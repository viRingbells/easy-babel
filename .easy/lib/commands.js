'use strict';

'node version >= 5.0.0';

var cwd = process.cwd();
GLOBAL.commands_cwd = cwd;

var debug = require('debug')('easy-babel');
var exec = require('child_process').execSync;
var fs = require('fs');
var program = require('commander');
var path = require('path');
var depends = require('./depends');
var parse = require('./parse');

process.on('exit', function (code) {
    debug('Command: cd back to ' + cwd);
    process.chdir(cwd);
});

debug('Commands: initializing commands');
program.usage('[options] <action> <file>');

program.on('--help', function () {
    console.log('  Examples:');
    console.log('');
    console.log('    $ easy depends');
    console.log('    $ easy release');
    console.log('    $ easy run app.js');
    console.log('');
});

program.option('-v, --nodeversion <node version>', 'adapt to a certain version of node, default is ' + process.version).option('-n, --nodeargs <node args>', 'pass node arguments to the script').option('-s, --scriptargs <script args>', 'pass script arguments to the script');

program.command('parse [targets...]').alias('release').action(parse);

program.command('depends [targets...]').alias('dependencies').action(depends);

program.command('run [target]').alias('start').action(run);

program.command('*').action(help);

/**
 * Print help if exec without argv
 **/
if (!process.argv.slice(2).length) {
    process.nextTick(function () {
        program.outputHelp();
    });
}

function help() {
    program.outputHelp();
}

function run(target) {
    debug('Commands: run ' + target);
    var execPath = process.execPath;
    process.chdir(cwd);
    if (!path.isAbsolute(target)) {
        target = path.join(cwd, target);
    }
    var basename = path.basename(target);
    var dirname = path.dirname(target);
    var split = dirname.split('/');
    var easypath = target;
    for (var i = 0; i < split.length; i++) {
        var tmppath = path.join(split.slice(0, split.length - i).join('/'), '.easy', split.slice(split.length - i).join('/'), basename);
        if (fs.existsSync(tmppath)) {
            easypath = tmppath;
        }
    }
    debug('Commands: exec ' + execPath + ' ' + (program.nodeargs || '') + ' ' + easypath + ' ' + (program.scriptargs || ''));
    var out = exec(execPath + ' ' + (program.nodeargs || '') + ' ' + easypath + ' ' + (program.scriptargs || ''));
    console.log(out.toString().replace(/\n$/, ''));
}

debug('Commands: start to parse process argv');
module.exports = function () {
    program.parse(process.argv);
};

debug('Commands: loaded');