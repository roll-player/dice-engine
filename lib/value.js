"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Value = function () {
  function Value(value) {
    _classCallCheck(this, Value);

    this.value = +value;
  }

  _createClass(Value, [{
    key: "toString",
    value: function toString(expanded) {
      if (!expanded) {
        return this.value;
      }

      return "[ " + this.value + " ]";
    }
  }, {
    key: "input",
    get: function get() {
      return this.value;
    }
  }], [{
    key: "ensure",
    value: function ensure(value) {
      if (value.value) {
        return value;
      } else {
        return new Value(value);
      }
    }
  }]);

  return Value;
}();

exports.default = Value;