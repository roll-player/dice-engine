import Value from './value'

const getMathValues = (left, right) => {
    let leftValue = 0
    let rightValue = 0

    if (!left || !right) {
      throw new Error('Must provide both values to math')
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
    this.operator = token
  }

  get value () {
    let values = getMathValues(this.left, this.right)
    switch (this.operator) {
      case '+':
        return values.left + values.right
      case '-':
        return values.left - values.right
    }
  }

  toString (expanded = false) {
    let values = getMathValues(this.left, this.right)

    if (!expanded) {
      console.log('value', this.value)
      return '' + this.value
    }

    console.log('Getting math string')
    return `[${values.left.toString(true)} ${this.operator} ${values.right.toString(true)}]`
  }
}
