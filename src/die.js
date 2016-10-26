export default class Die {
  constructor (value, sides) {
    this.__value__ = value
    this.__sides__ = sides
    this.__invalid__ = false
    this.__reasons__ = []
  }

  Invalidate (reason) {
    this.__invalid__ = true
    this.__reasons__.push(reason)
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

  get reasons () {
    return this.__reasons__
  }
}
