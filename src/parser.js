import Dice from './dice'
import MathDie from './mathDie'
import Value from './value'
const operatorTable = {
  'd' : {precedence: 0, args: 2},
  'k' : {precedence: 0, args: 2},
  'v' : {precedence: 0, args: 2},
  'r' : {precedence: 0, args: 2}, 
  'ro': {precedence: 0, args: 2},
  'r<': {precedence: 0, args: 2},
  'r>': {precedence: 0, args: 2}
}

const parse = input => {
  return new Promise((resolve, reject) => {
    // this currently requires two passes over the input
    // for now this is fine. Since most commands are small
    // this should be optimized at some point
    let tokenized = input.split('');
    let index = 0;
    let joined = [];

    let collected = [];

    while(index < tokenized.length) {
      let token = tokenized[index];

      if(!isOperator(token)) {
        collected.push(token);
      } else {
        if(collected.length > 0) {
          let join = collected.join('');
          collected = [];
          joined.push(join);
        }

        if(token == 'r') {
          let next = tokenized[index + 1];
          if(next == 'o' || next == '<' || next == '>') {
            token += next;
            index++;
          }
        }

        joined.push(token);
      }

      index++;
    }

    if(collected.length > 0) {
      let join = collected.join('');
      collected = [];
      joined.push(join);
    }

    tokenized = joined;

    let token = null; 
    let output = [];
    let operators = [];
    // start construction of the tree
    while(token = tokenized.shift()) {
      if(isOperator(token)) {

        // this really should move all lower precendece operators off the stack
        // this isn't a problem since we have no grouping operations
        let checkTop = true
        while(checkTop) {
          let top = operators[operators.length - 1];
          if(top != null && operatorTable[top].precedence <= operatorTable[token].precedence) {
            output.push(/* top */ operators.pop());
          } 
          else {
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

    while(token = operators.pop()) {
      output.push(token);
    }

    resolve(output);
  });
}

const isOperator = token => {
  return Object.keys(operatorTable).indexOf(token) !== -1
}

const evaluate = rpn => {
  let operator = null;
  let stack = []

  let result = null 

  for (var i = 0; i < rpn.length; i++) {
    let token = rpn[i]
    if (isOperator(token)) {
      switch (token) {
        case 'd':
          let sides = stack.pop()
          let number = stack.pop() || result || 1
          result = new Dice(number, sides)
        case 'k':
        case 'v':
        case 'r':
        case 'ro':
        case 'r<':
        case 'r>':
          // we don't need to add this dice to the stack since we care about the final result of the dice
          let value = stack.pop()
          let dice = stack.pop() || result
          
          if (dice.type && dice.type !== 'dice') {
            throw new Error('Not a dice')
          }

          switch (token) {
            case 'k':
              dice.keep(value, `k${value}`)
              break
            case 'v':
              dice.drop(value, `v${value}`)
              break
            case 'r':
              dice.reroll([value], `r${value}`)
              break
            case 'ro':
              dice.reroll([value], true, `ro${value}`)
              break
            case 'r<':
            case 'r>':
              let values = []
              switch (token) {
                case 'r<':
                  for (let i = 1; i <= value; i++) {
                    values.push(i)
                  }
                  break
                case 'r>':
                  for (let j = value; j <= dice.sides; j++) {
                    values.push(j) 
                  }
              }
              dice.reroll(values, true), `${token}${value}`
          }
          break
      }
    }
    else {
      stack.push(token)
    }
  }

  if (stack.length > 0) {
    if (stack.length == 1) {
      return new Value(stack.pop())
    } else {
      throw new Error('Unable to properly parse the input') 
    }
  }

  return result
}

const getDicePromise = diceString => {
  return new Promise((resolve, reject) => {
    parse(diceString)
      .then(rpn =>  {
          let evaluated = evaluate(rpn)
          resolve(evaluated) 
      })
      .catch(err => reject(err))
  })
}

const splitDice = input => {
  return new Promise((resolve, reject) => {
    var splitters = /[+|-]/g
    var diceStrings = input.split(splitters)
    var foundSplitters = input.match(splitters)
    var dicePromises = diceStrings.map(getDicePromise)

    Promise.all(dicePromises)
      .then(rolls => {
        if (!foundSplitters) {
          resolve(rolls[0]) 
          return
        }

        let mathDie = null

        foundSplitters.forEach(splitter => {
          let left = mathDie || rolls.shift()
          let right = rolls.shift()
          mathDie = new MathDie(left, right, splitter)
        })

        resolve(mathDie)
        return
      }).catch(reason => reject(reason))
  })
}

export default class Parser {
  static Parse (input) {
    return splitDice(input)
  }

  static GetRPN (input) {
    return parse(input) 
  }

  static Evaluate (rpn) {
    return evaluate(rpn) 
  }
}
