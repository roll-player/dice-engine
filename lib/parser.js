'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dice = require('./dice');

var _dice2 = _interopRequireDefault(_dice);

var _mathDie = require('./mathDie');

var _mathDie2 = _interopRequireDefault(_mathDie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var operatorTable = {
  'd': { precedence: 0, args: 2 },
  'k': { precedence: 0, args: 2 },
  'v': { precedence: 0, args: 2 },
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
      var _token = tokenized[index];
      console.log('token', _token);

      if (!isOperator(_token)) {
        console.log('pushing the token to collected');
        collected.push(_token);
      } else {
        console.log('is an operator');
        if (collected.length > 0) {
          var join = collected.join('');
          collected = [];
          joined.push(join);
          console.log('joined is now', joined);
        }

        if (_token == 'r') {
          console.log('creating reroll special cases');
          var next = tokenized[index + 1];
          if (next == 'o' || next == '<' || next == '>') {
            _token += next;
            index++;
          }
        }

        joined.push(_token);
        console.log('joined is now', joined);
      }

      index++;
    }

    if (collected.length > 0) {
      var _join = collected.join('');
      collected = [];
      joined.push(_join);
    }

    tokenized = joined;

    console.log('tokens are now', tokenized);
    var token = null;
    var output = [];
    var operators = [];
    // start construction of the tree
    while (token = tokenized.shift()) {
      if (isOperator(token)) {

        // this really should move all lower precendece operators off the stack
        // this isn't a problem since we have no grouping operations
        var checkTop = true;
        while (checkTop) {
          var top = operators[operators.length - 1];
          if (top != null && operatorTable[top].precedence <= operatorTable[token].precedence) {
            console.log('found a lower order operator on the stack', top);
            output.push( /* top */operators.pop());
          } else {
            // we found a higher order operator so were going to stop checking
            checkTop = false;
          }
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
  var operator = null;
  var stack = [];

  var result = [];

  for (var i = 0; i < rpn.length; i++) {
    var token = rpn[i];
    if (isOperator(token)) {
      switch (token) {
        case 'd':
          var sides = stack.pop();
          var number = stack.pop() || result[result.length - 1] || 1;
          number = number.value ? number.value : number;
          result.push(new _dice2.default(+number, +sides));
        case 'k':
        case 'v':
        case 'r':
          // we don't need to add this dice to the stack since we care about the final result of the dice
          var value = stack.pop();
          var dice = stack.pop() || result[result.length - 1];

          if (dice.type && dice.type !== 'dice') {
            throw new Error('Not a dice');
          }

          switch (token) {
            case 'k':
              dice.keep(value);
              break;
            case 'v':
              dice.drop(value);
              break;
            case 'r':
              dice.reroll(value);
              break;
          }
          break;
        case '+':
        case '-':
          var right = stack.pop();
          var left = stack.pop();

          if (!left) {
            left = result.pop();
          }

          if (!right) {
            right = result.pop();
          }

          result.push(new _mathDie2.default(left, right, token));
          break;
      }
    } else {
      stack.push(token);
    }
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
          var evaluated = evaluate(rpn);
          resolve(evaluated);
        }).catch(function (err) {
          return reject(err);
        });
      });
    }
  }, {
    key: 'RPN',
    value: function RPN(input) {
      return parse(input);
    }
  }]);

  return Parser;
}();

exports.default = Parser;