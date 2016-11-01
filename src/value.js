export default class Value {
  constructor (value) {
    this.value = +value
  }

  get input () {
    return this.value
  }

  toString (expanded) {
    if (!expanded) {
      return this.value
    }

    return `[ ${this.value} ]`
  }

  static ensure (value) {
    if (value.value) {
      return value
    } else {
      return new Value(value)
    }
  }
}
