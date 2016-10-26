"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Die = function () {
  function Die(value, sides) {
    _classCallCheck(this, Die);

    this.__value__ = value;
    this.__sides__ = sides;
    this.__invalid__ = false;
    this.__reasons__ = [];
  }

  _createClass(Die, [{
    key: "Invalidate",
    value: function Invalidate(reason) {
      this.__invalid__ = true;
      this.__reasons__.push(reason);
    }
  }, {
    key: "value",
    get: function get() {
      return this.__value__;
    }
  }, {
    key: "sides",
    get: function get() {
      return this.__sides__;
    }
  }, {
    key: "invalid",
    get: function get() {
      return this.__invalid__;
    }
  }, {
    key: "reasons",
    get: function get() {
      return this.__reasons__;
    }
  }]);

  return Die;
}();

exports.default = Die;