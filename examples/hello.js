/**
 * Example of print hello world
 **/
'use strict';

var _debug  = require('debug');

var debug = _debug('easy-babel');

debug("Example: some frequently used syntax");

debug('Example: arrow functions');
var a = () => {};

debug('Example: class');
class B {}

debug('Example: enhanced objects');
var c = {
    a,
    method () {}
}

debug('Example: template string');
`how are you`;
`line1
line2`
var tmp1 = 'tmp1';
var tmp2 = 'tmp2';
var d = `One is ${tmp1} and the other is ${tmp2}`;

debug('Example: destructuring');
var [e, f] = [1, 2, 3];

debug('Example: default param');
function g (a, b = 3, c) {};

debug('Example: spread');
var tmp1 = [1, 2, 3];
var h = [...tmp1];

debug('Example: rest');
var [...i] = [1, 2, 3];

debug('Example: let');
let j = 1;

debug('Example: const');
const k = 1;

debug('Example: for of');
var tmp1 = [1, 2, 3, 4];
for (var l of tmp1) {}

debug('Example: modules');
import assert from 'assert';

debug('Example: export');
export default 'export';

debug('Example: async/await');
async function tmp1 () {};
async function m () { await tmp1(); }
m();
