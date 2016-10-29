'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dice = require('./dice');

var _dice2 = _interopRequireDefault(_dice);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var operatorTable = {
  'd': { precedence: 0, args: 2 },
  'k': { precedence: 0, args: 2 },
  'r': { precedence: 0, args: 2 },
  'ro': { precedence: 0, args: 2 },
  'r<': { precedence: 0, args: 2 },
  'r>': { precedence: 0, args: 2 },
  '+': { precedence: 1, args: 2 },
  '-': { precedence: 1, args: 2 }
};

var parse = function parse(input) {
  return new Promise(function (resolve, reject) {
    // this currently requires two passes over the input
    // for now this is fine. Since most commands are small
    // this should be optimized at some point
    var tokenized = input.split('');
    var index = 0;
    var joined = [];

    var collected = [];

    while (index < tokenized.length) {
      if (!isOperator(tokenized[index])) {
        collected.push(tokenized[index]);
      } else {
        if (collected.length > 0) {
          var join = collected.join('');
          collected = [];
          joined.push(join);
        }
        var _token = tokenized[index];
        if (_token == 'r') {
          var next = tokenized[index + 1];
          if (next == 'o' || next == '<' || next == '>') {
            _token += next;
            index++;
          }
        }
        joined.push(_token);
      }
      index++;
    }
    if (collected.length > 0) {
      var _join = collected.join('');
      collected = [];
      joined.push(_join);
    }

    tokenized = joined;
    var token = null;
    var output = [];
    var operators = [];
    // start construction of the tree
    while (token = tokenized.shift()) {
      if (isOperator(token)) {

        // this really should move all lower precendece operators off the stack
        // this isn't a problem since we have no grouping operations
        var top = operators[operators.length - 1];
        if (top != null && operatorTable[top].precedence <= operatorTable[token].precedence) {
          output.push(operators.pop());
        }
        operators.push(token);
        output.push(tokenized.shift() || 1);
      } else {
        output.push(token);
      }
    }

    while (token = operators.pop()) {
      output.push(token);
    }

    resolve(output);
  });
};

var isOperator = function isOperator(token) {
  return Object.keys(operatorTable).indexOf(token) !== -1;
};

var evaluate = function evaluate(rpn) {
  console.log('evaluate');
  var operator = null;
  var stack = [];

  var result = [];

  for (var i = 0; i < rpn.length; i++) {
    var token = rpn[i];
    if (isOperator(token)) {
      console.log('found token', token);
      switch (token) {
        case 'd':
          var sides = stack.pop();
          var number = stack.pop() || result[result.length - 1] || 1;
          console.log('previous result', result[result.length - 1]);
          console.log('number', number);
          number = number.value ? number.value : number;
          result.push(new _dice2.default(+number, +sides));
          break;
      }
    } else {
      stack.push(token);
    }

    console.log('result', result);
  }

  return result;
};

var Parser = function () {
  function Parser() {
    _classCallCheck(this, Parser);
  }

  _createClass(Parser, null, [{
    key: 'Parse',
    value: function Parse(input) {
      return new Promise(function (resolve, reject) {
        parse(input).then(function (rpn) {
          return resolve(evaluate(rpn));
        }).catch(reject);
      });
    }
  }]);

  return Parser;
}();

exports.default = Parser;