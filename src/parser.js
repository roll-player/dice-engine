import Dice from './dice'

const operatorTable = {
  'd' : {precedence: 0, args: 2},
  'k' : {precedence: 0, args: 2},
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
      if(!isOperator(tokenized[index])) {
        collected.push(tokenized[index]);
      } else {
        if(collected.length > 0) {
          let join = collected.join('');
          collected = [];
          joined.push(join);
        }
        let token = tokenized[index];
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
        let top = operators[operators.length - 1];
        if(top != null && operatorTable[top].precedence <= operatorTable[token].precedence) {
          output.push(operators.pop());
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
  console.log('evaluate')
  let operator = null;
  let stack = []

  let result = []

  for (var i = 0; i < rpn.length; i++) {
    let token = rpn[i]
    if (isOperator(token)) {
      console.log('found token', token)
      switch (token) {
        case 'd':
          let sides = stack.pop()
          let number = stack.pop() || result[result.length - 1] || 1
          console.log('previous result', result[result.length - 1])
          console.log('number', number)
          number = number.value ? number.value : number
          result.push(new Dice(+number, +sides))
          break
      }
    }
    else {
      stack.push(token)
    }

    console.log('result', result)
  }

  return result
}

export default class Parser {
  static Parse (input) {
    return new Promise((resolve, reject) => {
      parse(input)
        .then(rpn => resolve(evaluate(rpn)))
        .catch(reject)
    })
  }
}
