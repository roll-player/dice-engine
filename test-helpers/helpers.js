export function toBeRoll (util, customEqualityTests) {
  return {
    compare: (actual, expected) => {
      let matchDie = expected !== undefined

      var result = {}

      if (matchDie) {
        result.pass = (actual.number === expected.number && actual.sides === expected.sides)
        if (result.pass) {
          result.message = 'Die is correct' 
        } else {
          result.message = `Expected ${expected.number}d${expected.sides} got ${actual.number}d${actual.sides}`
        }
      } else {
        result.pass = (actual.number !== undefined && actual.sides !== undefined)
        if (result.pass) {
          result.message = 'It is a die!'
        } else {
          result.message = 'Expected to be a die and was not'
        }
      }

      return result
    } 
  }
}

const checkDiceStat = (stat, actual, expected, result) => {
  if (expected[stat]) {
    result.pass = result.pass && expected[stat] === actual.stats[stat]

    if (result.pass) {
      result.message += `${stat} was equal, `
    } else {
      result.message += `${stat} was expected to be ${expected[stat]} but was actually ${actual.stats[stat]}, `
    }
  }
}
export function toHaveDice (util, customEqualityTests) {
  return {
    compare: (actual, expected) => {
      expected = expected || {}

      let result = { pass: true, message: '' }

      if (!actual.rolledDice) {
        result = {
            pass: false,
            message: 'No dice'
        }
      }

      ['totalRolled', 'valid', 'invalid', 'dropped', 'rerolled'].forEach(stat => {
        checkDiceStat(stat, actual, expected, result)
      })

      return result
    } 
  }
}
