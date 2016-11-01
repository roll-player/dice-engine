'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _value = require('./value');

var _value2 = _interopRequireDefault(_value);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MathDie = function () {
  function MathDie() {
    _classCallCheck(this, MathDie);

    this.__values__ = [];
    this.__value__ = 0;
    this.__input__ = '';
  }

  _createClass(MathDie, [{
    key: 'addValue',
    value: function addValue(value) {
      var operation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      value = _value2.default.ensure(value);
      this.__values__.push({ value: value, operation: operation });

      switch (operation) {
        case '-':
          this.__value__ -= value.value;
          break;
        case '+':
        default:
          this.__value__ += value.value;
          break;
      }

      this.__input__ += '' + operation + value.input;
    }
  }, {
    key: 'toString',
    value: function toString() {
      var expanded = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!expanded) {
        return '' + this.value;
      }

      var output = this.__values__.map(function (pair) {
        return '' + pair.operation + pair.value.toString(true);
      }).join('');

      return '{ ' + this.input + ' : ' + this.value + ' -> ' + output + '}';
    }
  }, {
    key: 'value',
    get: function get() {
      return this.__value__;
    }
  }, {
    key: 'input',
    get: function get() {
      return this.__input__;
    }
  }]);

  return MathDie;
}();

exports.default = MathDie;