export default class Die {
  constructor (value, sides) {
    this.__value__ = value
    this.__sides__ = sides
    this.__invalid__ = false
    this.__reason__ = '' 
  }

  Invalidate (reason) {
    this.__invalid__ = true
    this.__reason__ = reason
  }

  toString (expanded = true, child = true) {
    if (this.invalid) {
      return `[${this.reason} ${this.value}]` 
    }

    return `${this.value}`
  }

  get value () {
    return this.__value__
  }

  get sides () {
    return this.__sides__
  }

  get invalid () {
    return this.__invalid__
  }

  get reason () {
    return this.__reason__
  }

}
