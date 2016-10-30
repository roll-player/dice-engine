export default class Value {
  constructor(value) {
    this.value = +value
  }

  toString (expanded) {
    if (!expanded) {
      return this.value
    }

    return `[ ${this.value} ]` 
  }
}
