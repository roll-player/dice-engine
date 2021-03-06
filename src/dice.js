import { isNumber } from 'lodash'
import Die from './die'
import Random from 'random-js'
import Value from './value'

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
  constructor (number, sides, roll = true) {
    if (number.value) {
      this.left = number
      number = number.value
    }

    if (sides.value) {
      this.right = sides
      sides = sides.value
    }

    if (!isNumber(+number) && !isNumber(+sides)) {
      throw new Error('Must provide valid arguments')
    }

    this.type = 'dice'
    this.number = +number
    this.sides = +sides
    this.rightString = ''
    this.rolledDice = []
    this.__rolled__ = false

    if (roll) {
      this.roll()
    }
  }

  roll () {
    if (!this.__rolled__) {
      this.rolledDice = makeDice(this.number, this.sides)
    }
  }

  get value () {
    return this.rolledDice.reduce((initial, die) => {
      if (die.invalid) {
        return initial
      }

      return initial + die.value
    }, 0)
  }

  rerollOnce (values, append = '') {
    this.rightString += append
    this.reroll(values, true)
  }

  setDieInvalid (die, reason) {
    die.invalid = true
    die.reason = reason
  }

  reroll (values, once = false, append = '') {
    this.rightString += append

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

  drop (count, append = '') {
    count = Value.ensure(count)

    this.rightString += append

    if (count.value <= 0) {
      return
    }

    // first determine which dice are the lowest dice
    let lowest = this.rolledDice.filter(die => !die.invalid)
      .map(die => die.value) 
      .sort((a, b) => a - b)
      .splice(0, count.value) 

    if (lowest.length != count.value) {
      throw new Error('Found incorrect number of dice')
    }

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

      let lowestIndex = lowest.indexOf(die.value)

      if (lowestIndex >= 0) {
          die.Invalidate(InvalidReasons.DROPPED)
          lowest.splice(lowestIndex, 1)
      }
    })
  }

  keep (count, append) {
    // a keep is just an inverse drop
    count = Value.ensure(count)
    let toDrop = Math.max(this.number - count.value, 0)
    this.drop(toDrop, append)
  }

  get stats () {
    return this.rolledDice.reduce((stats, die) => {
      stats.totalRolled++

      if (die.invalid) {
        stats.invalid++

        switch (die.reason) {
          case InvalidReasons.DROPPED:
            stats.dropped++
            break
          case InvalidReasons.REROLL:
            stats.rerolled++
            break
        }
      } else {
        stats.valid++
      }

      return stats
    }, {
      totalRolled: 0,
      valid: 0,
      invalid: 0,
      dropped: 0,
      rerolled: 0
    })
  }

  diceInput (expanded) {
    let dieString = ''

    if (this.left) {
      dieString += `${this.left.value} -> ${this.left.toString(expanded)}`
    } else {
      dieString += this.number
    }

    dieString += 'd'

    if (this.right) {
      dieString += `${this.right.value} -> ${this.right.toString(expanded)}`
    } else {
      dieString += this.sides
    }

    dieString += this.rightString

    return dieString
  }

  get input () {
    return this.diceInput(false)
  }

  toString (expanded = false) {
    if (!expanded) {
      return this.value
    }

    let diceStrings = this.rolledDice.map(die => die.toString())

    return `[ ${this.diceInput(expanded)} : ${this.value} -> ${diceStrings.join(' ')} ]`
  }

  static createDice (number, sides) {
    return new Dice(number, sides)
  }

  static get InvalidReasons () {
    return InvalidReasons
  }
}
