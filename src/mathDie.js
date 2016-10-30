import Value from './value'

const getMathValues = (left, right) => {
    let leftValue = 0
    let rightValue = 0

    if (!left || !right) {
      throw new Nerror('Must provide both values to math')
    }
    if (left.value) {
      leftValue = left
    } else {
      leftValue = new Value(left)
    }

    if (right.value) {
      rightValue = right
    } else {
      rightValue = new Value(right)
    }

  return { left: leftValue, right: rightValue }
}

export default class MathDie {
  constructor (left, right, token) {
    this.left = left
    this.right = right
    this.token = token
  }

  get value () {
    let values = getMathValues(this.left, this.right)
    switch (this.token) {
      case '+':
        return values.left + values.right
      case '-':
        return values.left - values.right
    }
  }

  toString () {
    let values = getMathValues(this.left, this.right)
    return `${values.left.toString()} ${this.token} ${values.right.toString()}`
  }
}
