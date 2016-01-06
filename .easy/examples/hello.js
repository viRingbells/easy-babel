/**
 * Example of es6
 **/
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _debug = require('debug');

var debug = _debug('easy-babel');

debug("Example: some frequently used syntax");

debug('Example: arrow functions');
var a = function a() {};

debug('Example: class');

var B = function B() {
  _classCallCheck(this, B);
};

debug('Example: enhanced objects');
var c = {
  a: a,
  method: function method() {}
};

debug('Example: template string');
'how are you';
'line1\nline2';
var tmp1 = 'tmp1';
var tmp2 = 'tmp2';
var d = 'One is ' + tmp1 + ' and the other is ' + tmp2;

debug('Example: destructuring');
var _ref = [1, 2, 3];
var e = _ref[0];
var f = _ref[1];

debug('Example: default param');
function g(a) {
  var b = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];
  var c = arguments[2];
};

debug('Example: spread');
var tmp3 = [1, 2, 3];
var h = [].concat(tmp3);

debug('Example: rest');
var i = [1, 2, 3];

debug('Example: let');
var j = 1;

debug('Example: const');
var k = 1;

debug('Example: for of');
var tmp4 = [1, 2, 3, 4];
for (var _iterator = tmp4, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
  var _ref2;

  if (_isArray) {
    if (_i >= _iterator.length) break;
    _ref2 = _iterator[_i++];
  } else {
    _i = _iterator.next();
    if (_i.done) break;
    _ref2 = _i.value;
  }

  var l = _ref2;
}

debug('Example: modules');

debug('Example: export');
exports.default = 'export';

debug('Example: async/await');

var tmp5 = (function () {
  var ref = _asyncToGenerator(function* () {});

  return function tmp5() {
    return ref.apply(this, arguments);
  };
})();

;

var m = (function () {
  var ref = _asyncToGenerator(function* () {
    yield tmp5();
  });

  return function m() {
    return ref.apply(this, arguments);
  };
})();

m();

//debug('Example: import es6');
//import es6 from 'es6';

console.log(process.argv);