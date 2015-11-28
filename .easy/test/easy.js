'use strict';

/**
 * Test
 **/

const debug = require('debug')('easy-babel');

const exec = require('child_process').execSync;
const path = require('path');
const should = require('should');
const home = path.join(__dirname, '..');

process.on('exit', code => {
    exec('cd ' + home + ' && rm -rf examples/node_modules && rm -rf examples/.easy');
});

['5.0.0', '4.0.0', '3.0.0', '2.0.0', '1.0.0', '0.11.0'].forEach(version => {
    describe('Node version is ' + version, () => {
        it('should be ok parsing examples dependencies', done => {
            let error = null;
            try {
                exec('cd ' + home + ' && rm -rf examples/node_modules && cp -r examples/node_modules_easy examples/node_modules && ./bin/release depends examples -v ' + version);
            } catch (e) {
                error = true;
                e.message.should.not.be.ok;
            }
            should(error).be.exactly(null);
            done();
        });

        it('should be ok parsing examples/hello.js', done => {
            let error = null;
            try {
                exec('cd ' + home + ' && ./bin/release release examples/hello.js -v ' + version);
            } catch (e) {
                error = true;
                e.message.should.not.be.ok;
            }
            should(error).be.exactly(null);
            done();
        });

        it('should be ok running examples/.easy/hello.js', done => {
            let error = null;
            try {
                exec('cd ' + home + ' && node examples/.easy/hello.js');
            } catch (e) {
                error = true;
                e.message.should.not.be.ok;
            }
            should(error).be.exactly(null);
            done();
        });

        it('should be ok running by easy-babel run examples/hello.js', done => {
            let error = null;
            done();
        });
    });
});

debug('Test: loaded');