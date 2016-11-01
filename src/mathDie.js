import Value from './value'

export default class MathDie {
  constructor () {
    this.__values__ = []
    this.__value__ = 0
    this.__input__ = ''
  }

  addValue (value, operation = '') {
    value = Value.ensure(value)
    this.__values__.push({ value, operation })

    switch (operation) {
      case '-':
        this.__value__ -= value.value
        break
      case '+':
      default:
        this.__value__ += value.value
        break
    }

    this.__input__ += `${operation}${value.input}`
  }

  get value () {
    return this.__value__
  }

  get input () {
    return this.__input__
  }

  toString (expanded = false) {
    if (!expanded) {
      return '' + this.value
    }

    const output = this.__values__.map(pair => {
      return `${pair.operation}${pair.value.toString(true)}`
    }).join('')

    return `{ ${this.input} : ${this.value} -> ${output}}`
  }
}
