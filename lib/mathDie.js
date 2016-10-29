'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getMathValues = function getMathValues(left, right) {
  var leftValue = 0;
  var rightValue = 0;
  if (left.value) {
    leftValue = left.value;
  } else {
    leftValue = +left;
  }

  if (right.value) {
    rightValue = right.value;
  } else {
    rightValue = +right;
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