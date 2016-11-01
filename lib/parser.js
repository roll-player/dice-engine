'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dice = require('./dice');

var _dice2 = _interopRequireDefault(_dice);

var _mathDie = require('./mathDie');

var _mathDie2 = _interopRequireDefault(_mathDie);

var _value = require('./value');

var _value2 = _interopRequireDefault(_value);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var operatorTable = {
  'd': { precedence: 0, args: 2 },
  'k': { precedence: 0, args: 2 },
  'v': { precedence: 0, args: 2 },
  'r': { precedence: 0, args: 2 },
  'ro': { precedence: 0, args: 2 },
  'r<': { precedence: 0, args: 2 },
  'r>': { precedence: 0, args: 2 }
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

      if (!isOperator(_token)) {
        collected.push(_token);
      } else {
        if (collected.length > 0) {
          var join = collected.join('');
          collected = [];
          joined.push(join);
        }

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
        var checkTop = true;
        while (checkTop) {
          var top = operators[operators.length - 1];
          if (top != null && operatorTable[top].precedence <= operatorTable[token].precedence) {
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

  var result = null;

  for (var i = 0; i < rpn.length; i++) {
    var token = rpn[i];
    if (isOperator(token)) {
      switch (token) {
        case 'd':
          var sides = stack.pop();
          var number = stack.pop() || result || 1;
          result = new _dice2.default(number, sides);
        case 'k':
        case 'v':
        case 'r':
        case 'ro':
        case 'r<':
        case 'r>':
          // we don't need to add this dice to the stack since we care about the final result of the dice
          var value = stack.pop();
          var dice = stack.pop() || result;

          if (dice.type && dice.type !== 'dice') {
            throw new Error('Not a dice');
          }

          switch (token) {
            case 'k':
              dice.keep(value, 'k' + value);
              break;
            case 'v':
              dice.drop(value, 'v' + value);
              break;
            case 'r':
              dice.reroll([value], 'r' + value);
              break;
            case 'ro':
              dice.reroll([value], true, 'ro' + value);
              break;
            case 'r<':
            case 'r>':
              var values = [];
              switch (token) {
                case 'r<':
                  for (var _i = 1; _i <= value; _i++) {
                    values.push(_i);
                  }
                  break;
                case 'r>':
                  for (var j = value; j <= dice.sides; j++) {
                    values.push(j);
                  }
              }
              dice.reroll(values, true, '' + token + value);
          }
          break;
      }
    } else {
      stack.push(token);
    }
  }

  if (stack.length > 0) {
    if (stack.length == 1) {
      return new _value2.default(stack.pop());
    } else {
      throw new Error('Unable to properly parse the input');
    }
  }

  return result;
};

var getDicePromise = function getDicePromise(diceString) {
  return new Promise(function (resolve, reject) {
    parse(diceString).then(function (rpn) {
      var evaluated = evaluate(rpn);
      resolve(evaluated);
    }).catch(function (err) {
      return reject(err);
    });
  });
};

var splitDice = function splitDice(input) {
  return new Promise(function (resolve, reject) {
    var splitters = /[+|-]/g;
    var diceStrings = input.split(splitters);
    var foundSplitters = input.match(splitters);
    var dicePromises = diceStrings.map(getDicePromise);

    Promise.all(dicePromises).then(function (rolls) {
      if (!foundSplitters) {
        resolve(rolls[0]);
        return;
      }

      var mathDie = new _mathDie2.default();

      console.log('first die');
      mathDie.addValue(rolls.shift(), ' ');

      foundSplitters.forEach(function (splitter) {
        var value = rolls.shift();
        mathDie.addValue(value, splitter);
      });

      resolve(mathDie);
      return;
    }).catch(function (reason) {
      return reject(reason);
    });
  });
};

var Parser = function () {
  function Parser() {
    _classCallCheck(this, Parser);
  }

  _createClass(Parser, null, [{
    key: 'Parse',
    value: function Parse(input) {
      return splitDice(input);
    }
  }, {
    key: 'GetRPN',
    value: function GetRPN(input) {
      return parse(input);
    }
  }, {
    key: 'Evaluate',
    value: function Evaluate(rpn) {
      return evaluate(rpn);
    }
  }]);

  return Parser;
}();

exports.default = Parser;