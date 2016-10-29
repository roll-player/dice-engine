import Dice from './dice'
import MathDie from './mathDie'

const operatorTable = {
  'd' : {precedence: 0, args: 2},
  'k' : {precedence: 0, args: 2},
  'v' : {precedence: 0, args: 2},
  'r' : {precedence: 0, args: 2}, 
  'ro': {precedence: 0, args: 2},
  'r<': {precedence: 0, args: 2},
  'r>': {precedence: 0, args: 2},
  '+' : {precedence: 1, args: 2},
  '-' : {precedence: 1, args: 2}
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
      console.log('token', token)

      if(!isOperator(token)) {
        console.log('pushing the token to collected')
        collected.push(token);
      } else {
        console.log('is an operator')
        if(collected.length > 0) {
          let join = collected.join('');
          collected = [];
          joined.push(join);
          console.log('joined is now', joined)
        }

        if(token == 'r') {
          console.log('creating reroll special cases')
          let next = tokenized[index + 1];
          if(next == 'o' || next == '<' || next == '>') {
            token += next;
            index++;
          }
        }

        joined.push(token);
        console.log('joined is now', joined)
      }

      index++;
    }

    if(collected.length > 0) {
      let join = collected.join('');
      collected = [];
      joined.push(join);
    }

    tokenized = joined;

    console.log('tokens are now', tokenized)
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
            console.log('found a lower order operator on the stack', top)
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

  let result = []

  for (var i = 0; i < rpn.length; i++) {
    let token = rpn[i]
    if (isOperator(token)) {
      switch (token) {
        case 'd':
          let sides = stack.pop()
          let number = stack.pop() || result[result.length - 1] || 1
          number = number.value ? number.value : number
          result.push(new Dice(+number, +sides))
        case 'k':
        case 'v':
        case 'r':
          // we don't need to add this dice to the stack since we care about the final result of the dice
          let value = stack.pop()
          let dice = stack.pop() || result[result.length - 1]
          
          if (dice.type && dice.type !== 'dice') {
            throw new Error('Not a dice')
          }

          switch (token) {
            case 'k':
              dice.keep(value)
              break
            case 'v':
              dice.drop(value)
              break
            case 'r':
              dice.reroll(value)
              break
          }
          break
        case '+':
        case '-':
          let right = stack.pop()
          let left = stack.pop()

          if (!left ) {
            left = result.pop()
          }

          if (!right) {
            right = result.pop()
          }

          result.push(new MathDie(left, right, token))
          break
      }
    }
    else {
      stack.push(token)
    }
  }

  return result
}

export default class Parser {
  static Parse (input) {
    return new Promise((resolve, reject) => {
      parse(input)
        .then(rpn =>  {
            let evaluated = evaluate(rpn)
            resolve(evaluated) 
        })
        .catch(err => reject(err))
    })
  }

  static RPN (input) {
    return parse(input) 
  }
}
