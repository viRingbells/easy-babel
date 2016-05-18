'use strict';

/**
 * Test
 **/

var debug = require('debug')('easy-babel');

var exec = require('child_process').execSync;
var path = require('path');
var should = require('should');
var home = path.join(__dirname, '..');

process.on('exit', function (code) {
    exec('cd ' + home + ' && rm -rf examples/node_modules && rm -rf examples/.easy');
});

['6.0.0', '5.0.0', '4.0.0', '3.0.0', '2.0.0', '1.0.0', '0.11.9'].forEach(function (version) {
    describe('Node version is ' + version, function () {
        it('should be ok parsing examples dependencies', function (done) {
            var error = null;
            try {
                exec('cd ' + home + ' && rm -rf examples/node_modules && cp -r examples/node_modules_easy examples/node_modules && ./bin/release depends examples -v ' + version);
            } catch (e) {
                error = true;
                e.message.should.not.be.ok;
            }
            should(error).be.exactly(null);
            done();
        });

        it('should be ok parsing examples/hello.js', function (done) {
            var error = null;
            try {
                exec('cd ' + home + ' && ./bin/release release examples/hello.js -v ' + version);
            } catch (e) {
                error = true;
                e.message.should.not.be.ok;
            }
            should(error).be.exactly(null);
            done();
        });

        it('should be ok running examples/.easy/hello.js', function (done) {
            var error = null;
            try {
                exec('cd ' + home + ' && node examples/.easy/hello.js');
            } catch (e) {
                error = true;
                e.message.should.not.be.ok;
            }
            should(error).be.exactly(null);
            done();
        });

        it('should be ok running by easy-babel run examples/hello.js', function (done) {
            var error = null;
            done();
        });
    });
});

debug('Test: loaded');