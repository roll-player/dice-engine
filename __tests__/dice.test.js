import { createDice } from '../src/dice'
import Die from '../src/die'

const getDiceValue = dice => {
  return dice.rolledDice.reduce((initial, die) => {
    if (die.invalid) {
      return initial
    }

    return initial + die.value
  }, 0)
}

const generateDice = (values, sides) => {
  return values.map(value => {
    return new Die(value, sides)
  })
}

describe('Dice', () => {
  it('should throw an error if constructed incorrectly', () => {
    try {
      const dice = createDice('1', '2') // eslint-disable-line
    } catch (e) {
      expect(e.message).toEqual('Must provide numbers as arguments')
    }
  })

  it('should construct the correct number of dice', () => {
    const dice = createDice(1, 1)
    expect(dice.number).toEqual(1)
  })

  it('should construct dice with the correct number of sides', () => {
    const dice = createDice(2, 1)
    expect(dice.sides).toEqual(1)
  })

  it('should roll the correct amount of dice', () => {
    const dice = createDice(2, 1)
    expect(dice.rolledDice.length).toEqual(2)
  })

  describe('rolling', () => {
    it('should return the correct value for two one-side die', () => {
      const dice = createDice(2, 1)
      expect(dice.value).toEqual(2)
    })

    it('should have the proper value', () => {
      const dice = createDice(6, 4)
      let rolled = getDiceValue(dice)
      expect(dice.value).toEqual(rolled)
    })

    it('should reroll any dice that are in the target', () => {
      const dice = createDice(6, 6)
      dice.rolledDice = generateDice([1, 1, 1, 1, 1, 1], 6)
      dice.reroll([1], 'r1')

      dice.rolledDice.forEach(die => {
        if (die.invalid) {
          expect(die.value).toEqual(1)
          expect(die.reason).toEqual(Dice.InvalidReasons.REROLL)
        } else {
          expect(die.value).not.toEqual(1)
        }
      })
    })

    it('should drop the correct count of dice', () => {
      const dice = new Dice(6, 6)
      dice.rolledDice = generateDice([1, 1, 1, 6, 6, 6], 6)
      dice.drop(3)

      dice.rolledDice.forEach(die => {
        if (die.value === 1) {
          expect(die.invalid).toEqual(true)
          expect(die.reason).toEqual(Dice.InvalidReasons.DROPPED)
        } else {
          expect(die.value).toEqual(6)
        }
      })

      expect(dice.value).toEqual(18)
    })

    it('should keep the correct number of dice', () => {
      const dice = new Dice(6, 6)
      dice.rolledDice = generateDice([1, 1, 1, 6, 6, 6], 6)

      dice.keep(3)

      dice.rolledDice.forEach(die => {
        if (die.value === 1) {
          expect(die.invalid).toEqual(true)
          expect(die.reason).toEqual(Dice.InvalidReasons.DROPPED)
        } else {
          expect(die.value).toEqual(6)
        }
      })

      expect(dice.value).toEqual(18)
    })

    it('should only reroll once on a one time', () => {
      const dice = new Dice(6, 6)
      dice.rolledDice = generateDice([1, 1, 1, 6, 6, 6], 6)
      dice.rerollOnce([1])

      expect(dice.rolledDice.length).toEqual(9)

      expect(dice.rolledDice[0].invalid).toEqual(true)
      expect(dice.rolledDice[1].invalid).toEqual(true)
      expect(dice.rolledDice[2].invalid).toEqual(true)
    })
  })
})
