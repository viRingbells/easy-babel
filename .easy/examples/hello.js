/**
 * Example of es6
 **/
'use strict';

let tmp5 = (function () {
  var ref = _asyncToGenerator(function* () {});

  return function tmp5() {
    return ref.apply(this, arguments);
  };
})();

let m = (function () {
  var ref = _asyncToGenerator(function* () {
    yield tmp5();
  });

  return function m() {
    return ref.apply(this, arguments);
  };
})();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _debug = require('debug');

var debug = _debug('easy-babel');

debug("Example: some frequently used syntax");

debug('Example: arrow functions');
var a = () => {};

debug('Example: class');
class B {}

debug('Example: enhanced objects');
var c = {
  a,
  method() {}
};

debug('Example: template string');
`how are you`;
`line1
line2`;
var tmp1 = 'tmp1';
var tmp2 = 'tmp2';
var d = `One is ${ tmp1 } and the other is ${ tmp2 }`;

debug('Example: destructuring');
var _ref = [1, 2, 3];
var e = _ref[0];
var f = _ref[1];

debug('Example: default param');
function g(a) {
  let b = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];
  let c = arguments[2];
};

debug('Example: spread');
var tmp3 = [1, 2, 3];
var h = [...tmp3];

debug('Example: rest');
var i = [1, 2, 3];

debug('Example: let');
let j = 1;

debug('Example: const');
const k = 1;

debug('Example: for of');
var tmp4 = [1, 2, 3, 4];
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = tmp4[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var l = _step.value;
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

debug('Example: modules');

debug('Example: export');
exports.default = 'export';

debug('Example: async/await');
;

m();

//debug('Example: import es6');
//import es6 from 'es6';

console.log(process.argv);