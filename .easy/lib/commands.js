'use strict';

'node version >= 5.0.0';

const program = require('commander');
const debug = require('debug')('easy-babel');
const parse = require('./parse');
const cwd = process.cwd();

process.on('exit', code => {
    debug('Command: cd back to ' + cwd);
    process.chdir(cwd);
});

debug('Commands: initializing commands');
program.usage('[options] <action> <file>');

program.on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ easy depends');
    console.log('    $ easy release');
    console.log('    $ easy run app.js');
    console.log('');
});

program.option('-v, --nodeversion <node version>', 'adapt to a certain version of node, default is ' + process.version);

program.command('parse [targets...]').alias('release').action(parse);

program.command('depends').alias('dependencies').action(depends);

program.command('run [target]').alias('start').action(run);

program.command('*').action(help);

/**
 * Print help if exec without argv
 **/
if (!process.argv.slice(2).length) {
    process.nextTick(() => {
        program.outputHelp();
    });
}

function help() {
    program.outputHelp();
}

function depends() {}

function run() {}

debug('Commands: start to parse process argv');
program.parse(process.argv);

debug('Commands: loaded');