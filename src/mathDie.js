const getMathValues = (left, right) => {
    let leftValue = 0
    let rightValue = 0
    if (left.value) {
      leftValue = left.value
    } else {
      leftValue = +left 
    }

    if (right.value) {
      rightValue = right.value 
    } else {
      rightValue = +right
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
}
