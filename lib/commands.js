'use strict';

'node version >= 5.0.0';

const cwd     = process.cwd();
global.commands_cwd = cwd;

const debug   = require('debug')('easy-babel');
const exec    = require('child_process').execSync;
const fs      = require('fs');
const program = require('commander');
const path    = require('path');
const depends = require('./depends');
const parse   = require('./parse');

process.on('exit', (code) => {
    debug('Command: cd back to ' + cwd);
    process.chdir(cwd);
});

debug('Commands: initializing commands');
program
    .usage('[options] <action> <file>');

program
    .on('--help', () => {
        console.log('  Examples:');
        console.log('');
        console.log('    $ easy depends');
        console.log('    $ easy release');
        console.log('    $ easy run app.js');
        console.log('');
    });

program
    .option('-v, --nodeversion <node version>', 'adapt to a certain version of node, default is ' + process.version)
    .option('-n, --nodeargs <node args>', 'pass node arguments to the script')
    .option('-s, --scriptargs <script args>', 'pass script arguments to the script');

program
    .command('parse [targets...]')
    .alias('release')
    .action(parse);

program
    .command('depends [targets...]')
    .alias('dependencies')
    .action(depends);

program
    .command('run [target]')
    .alias('start')
    .action(run);

program
    .command('*')
    .action(help);

/**
 * Print help if exec without argv
 **/
if (!process.argv.slice(2).length) {
    process.nextTick(() => {
        program.outputHelp();
    });
}

function help () {
    program.outputHelp();
}

function run (target) {
    debug('Commands: run ' + target);
    const execPath = process.execPath;
    process.chdir(cwd);
    if (!path.isAbsolute(target)) {
        target = path.join(cwd, target);
    }
    const basename = path.basename(target);
    const dirname  = path.dirname(target);
    let split = dirname.split('/');
    let easypath = target;
    for (let i = 0; i < split.length; i++) {
        const tmppath = path.join(split.slice(0, split.length - i).join('/'), '.easy', split.slice(split.length - i).join('/'), basename);
        if (fs.existsSync(tmppath)) {
            easypath = tmppath;
        }
    }
    debug('Commands: exec ' + execPath + ' ' + (program.nodeargs || '') + ' ' + easypath + ' ' + (program.scriptargs || ''));
    let out = exec(execPath + ' ' + (program.nodeargs || '') + ' ' + easypath + ' ' + (program.scriptargs || ''));
    console.log(out.toString().replace(/\n$/,''));
}

debug('Commands: start to parse process argv');
module.exports = () => {
    program.parse(process.argv);
}

debug('Commands: loaded');
