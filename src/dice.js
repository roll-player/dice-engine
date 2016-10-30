import { isNumber } from 'lodash'
import Die from './die'
import Random from 'random-js'

const engine = Random.engines.mt19937().autoSeed()

const makeDice = (number, sides) => {
  return Random.dice(sides, number)(engine).map(die => {
    return new Die(die, sides)
  })
}

const InvalidReasons = {
  REROLL: 'reroll',
  DROPPED: 'drop'
}

export default class Dice
{
  constructor (number, sides) {
    if (!isNumber(number) && !isNumber(sides)) {
      throw new Error('Must provide numbers as arguments')
    }

    this.type = 'dice'
    this.number = number
    this.sides = sides
    this.rolledDice = makeDice(number, sides)
  }

  get value () {
    return this.rolledDice.reduce((initial, die) => {
      if (die.invalid) {
        return initial
      }

      return initial + die.value
    }, 0)
  }

  rerollOnce (values) {
    this.reroll(values, true)
  }

  setDieInvalid (die, reason) {
    die.invalid = true
    die.reasons.push(reason)
  }

  reroll (values, once = false) {
    let checkReroll = true
    let rerollAttempts = 0
    do {
      let additionalRolls = this.rolledDice.reduce((count, die) => {
        if (!die.invalid && values.indexOf(die.value) !== -1) {
          die.Invalidate(InvalidReasons.REROLL)
          count++
        }

        return count
      }, 0)

      this.rolledDice = this.rolledDice.concat(makeDice(additionalRolls, this.sides))

      checkReroll = additionalRolls > 0 && !once
      rerollAttempts++
    } while (checkReroll && rerollAttempts < 100)
  }

  drop (count) {
    if (count <= 0) {
      return
    }
    // first determine which dice are the lowest dice
    let lowest = []
    console.log('finding the ', count, 'lowest')
    this.rolledDice.forEach(die => {
      if (die.invalid || count == 0) {
        return
      }
      for (var i = 0; i < count; i++) {
        if (lowest[i] == null || die.value < lowest[i]) {
          // if the array is full replace this one
          if (lowest.length === count) {
            lowest[i] = die.value
          } else {
            lowest.push(die.value)
          }
          return
        }
      }
    })

    console.log('dropping', lowest)

    // enumerate through the dice once more dropping the first
    // of the lowest values that we find
    this.rolledDice.forEach(die => {
      if (die.invalid) {
        return
      }

      // ideally we may wish to bail out for large rolls
      if (lowest.length === 0) {
        return
      }

      for (var i = 0; i < lowest.length; i++) {
        if (die.value <= lowest[i]) {
          console.log('invalidating', die)
          die.Invalidate(InvalidReasons.DROPPED)
          // remove the item from the lowest collection
          lowest.splice(i, 1)
          // stop enumerating over the lowest
          return
        }
      }
    }, this.rolledDice)
  }

  keep (count) {
    // a keep is just an inverse drop
    let toDrop = Math.max(this.number - count, 0)
    this.drop(toDrop)
  }

  toString (expanded = false) {
    return this.value
  }

  static createDice (number, sides) {
    return new Dice(number, sides)
  }

  static get InvalidReasons () {
    return InvalidReasons
  }
}
