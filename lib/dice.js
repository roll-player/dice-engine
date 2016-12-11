'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _die = require('./die');

var _die2 = _interopRequireDefault(_die);

var _randomJs = require('random-js');

var _randomJs2 = _interopRequireDefault(_randomJs);

var _value = require('./value');

var _value2 = _interopRequireDefault(_value);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var engine = _randomJs2.default.engines.mt19937().autoSeed();

var makeDice = function makeDice(number, sides) {
  return _randomJs2.default.dice(sides, number)(engine).map(function (die) {
    return new _die2.default(die, sides);
  });
};

var InvalidReasons = {
  REROLL: 'reroll',
  DROPPED: 'drop'
};

var Dice = function () {
  function Dice(number, sides) {
    var roll = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    _classCallCheck(this, Dice);

    if (number.value) {
      this.left = number;
      number = number.value;
    }

    if (sides.value) {
      this.right = sides;
      sides = sides.value;
    }

    if (!(0, _lodash.isNumber)(+number) && !(0, _lodash.isNumber)(+sides)) {
      throw new Error('Must provide valid arguments');
    }

    this.type = 'dice';
    this.number = +number;
    this.sides = +sides;
    this.rightString = '';
    this.rolledDice = [];
    this.__rolled__ = false;

    if (roll) {
      this.roll();
    }
  }

  _createClass(Dice, [{
    key: 'roll',
    value: function roll() {
      if (!this.__rolled__) {
        this.rolledDice = makeDice(this.number, this.sides);
      }
    }
  }, {
    key: 'rerollOnce',
    value: function rerollOnce(values) {
      var append = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      this.rightString += append;
      this.reroll(values, true);
    }
  }, {
    key: 'setDieInvalid',
    value: function setDieInvalid(die, reason) {
      die.invalid = true;
      die.reason = reason;
    }
  }, {
    key: 'reroll',
    value: function reroll(values) {
      var once = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var append = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

      this.rightString += append;

      var checkReroll = true;
      var rerollAttempts = 0;
      do {
        var additionalRolls = this.rolledDice.reduce(function (count, die) {
          if (!die.invalid && values.indexOf(die.value) !== -1) {
            die.Invalidate(InvalidReasons.REROLL);
            count++;
          }

          return count;
        }, 0);

        this.rolledDice = this.rolledDice.concat(makeDice(additionalRolls, this.sides));

        checkReroll = additionalRolls > 0 && !once;
        rerollAttempts++;
      } while (checkReroll && rerollAttempts < 100);
    }
  }, {
    key: 'drop',
    value: function drop(count) {
      var append = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      count = _value2.default.ensure(count);

      this.rightString += append;

      if (count.value <= 0) {
        return;
      }

      // first determine which dice are the lowest dice
      var lowest = this.rolledDice.filter(function (die) {
        return !die.invalid;
      }).map(function (die) {
        return die.value;
      }).sort(function (a, b) {
        return a - b;
      }).splice(0, count.value);

      if (lowest.length != count.value) {
        throw new Error('Found incorrect number of dice');
      }

      // enumerate through the dice once more dropping the first
      // of the lowest values that we find

      this.rolledDice.forEach(function (die) {
        if (die.invalid) {
          return;
        }

        // ideally we may wish to bail out for large rolls
        if (lowest.length === 0) {
          return;
        }

        var lowestIndex = lowest.indexOf(die.value);

        if (lowestIndex >= 0) {
          die.Invalidate(InvalidReasons.DROPPED);
          lowest.splice(lowestIndex, 1);
        }
      });
    }
  }, {
    key: 'keep',
    value: function keep(count, append) {
      // a keep is just an inverse drop
      count = _value2.default.ensure(count);
      var toDrop = Math.max(this.number - count.value, 0);
      this.drop(toDrop, append);
    }
  }, {
    key: 'diceInput',
    value: function diceInput(expanded) {
      var dieString = '';

      if (this.left) {
        dieString += this.left.value + ' -> ' + this.left.toString(expanded);
      } else {
        dieString += this.number;
      }

      dieString += 'd';

      if (this.right) {
        dieString += this.right.value + ' -> ' + this.right.toString(expanded);
      } else {
        dieString += this.sides;
      }

      dieString += this.rightString;

      return dieString;
    }
  }, {
    key: 'toString',
    value: function toString() {
      var expanded = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (!expanded) {
        return this.value;
      }

      var diceStrings = this.rolledDice.map(function (die) {
        return die.toString();
      });

      return '[ ' + this.diceInput(expanded) + ' : ' + this.value + ' -> ' + diceStrings.join(' ') + ' ]';
    }
  }, {
    key: 'value',
    get: function get() {
      return this.rolledDice.reduce(function (initial, die) {
        if (die.invalid) {
          return initial;
        }

        return initial + die.value;
      }, 0);
    }
  }, {
    key: 'stats',
    get: function get() {
      return this.rolledDice.reduce(function (stats, die) {
        stats.totalRolled++;

        if (die.invalid) {
          stats.invalid++;

          switch (die.reason) {
            case InvalidReasons.DROPPED:
              stats.dropped++;
              break;
            case InvalidReasons.REROLL:
              stats.rerolled++;
              break;
          }
        } else {
          stats.valid++;
        }

        return stats;
      }, {
        totalRolled: 0,
        valid: 0,
        invalid: 0,
        dropped: 0,
        rerolled: 0
      });
    }
  }, {
    key: 'input',
    get: function get() {
      return this.diceInput(false);
    }
  }], [{
    key: 'createDice',
    value: function createDice(number, sides) {
      return new Dice(number, sides);
    }
  }, {
    key: 'InvalidReasons',
    get: function get() {
      return InvalidReasons;
    }
  }]);

  return Dice;
}();

exports.default = Dice;