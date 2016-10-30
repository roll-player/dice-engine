'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _value = require('./value');

var _value2 = _interopRequireDefault(_value);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getMathValues = function getMathValues(left, right) {
  var leftValue = 0;
  var rightValue = 0;

  if (!left || !right) {
    throw new Nerror('Must provide both values to math');
  }
  if (left.value) {
    leftValue = left;
  } else {
    leftValue = new _value2.default(left);
  }

  if (right.value) {
    rightValue = right;
  } else {
    rightValue = new _value2.default(right);
  }

  return { left: leftValue, right: rightValue };
};

var MathDie = function () {
  function MathDie(left, right, token) {
    _classCallCheck(this, MathDie);

    this.left = left;
    this.right = right;
    this.token = token;
  }

  _createClass(MathDie, [{
    key: 'toString',
    value: function toString() {
      var values = getMathValues(this.left, this.right);
      return values.left.toString() + ' ' + this.token + ' ' + values.right.toString();
    }
  }, {
    key: 'value',
    get: function get() {
      var values = getMathValues(this.left, this.right);
      switch (this.token) {
        case '+':
          return values.left + values.right;
        case '-':
          return values.left - values.right;
      }
    }
  }]);

  return MathDie;
}();

exports.default = MathDie;