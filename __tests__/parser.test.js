import Parser from '../src/parser'
import { toBeRoll, toHaveDice } from '../test-helpers/helpers'
import MathDie from '../src/mathDie'

beforeEach(() => {
  jasmine.addMatchers({ toBeRoll, toHaveDice }) 
})

describe('Parser', () => {

  describe('Single Rolls', () => {
    it('should handle a single Die', () => {
      const rollPromise = Parser.Parse('d20')

      rollPromise.then(roll => {
        expect(roll).toBeRoll({ number: 1, sides: 20})
      })

      return rollPromise
    })

    it('should handle a defined number of dice', () => {
      const rollPromise = Parser.Parse('2d20')

      rollPromise.then(roll => {
        expect(roll).toBeRoll({ number: 2, sides: 20 })
      })

      return rollPromise
    })

    it('should handle keeps', () => {
      const rollPromise = Parser.Parse('4d6k3')

      rollPromise.then(roll => {
        expect(roll).toHaveDice({ totalRolled: 4, dropped: 1, valid: 3})
      })

      return rollPromise
    })

    it('should handle drops', () => {
      const rollPromise = Parser.Parser('4d6v1')

      rollPromise.then(roll => {
        expect(roll).toHaveDice({ totalRolled: 4, dropped: 1, valid: 3})
      })

      return rollPromise
    })
  })

  describe('Combined Rolls', () => {
    it('should add modifiers to the roll', () => {
      const rollPromise = Parser.Parse('2d20+1') 

      rollPromise.then(roll => {
        expect(roll.left).toBeRoll({ number: 2, sides: 20 })
        expect(roll.right.value).toEqual(1)
        expect(roll.operator).toEqual('+')
      })

      return rollPromise
    })

    it('should handle multiple operators', () => {
      const rollPromise = Parser.Parse('2d20+3d4+1') 

      rollPromise.then(roll => {
        // the roll should be a MathDie
        expect(roll).toBeInstanceOf(MathDie)
        expect(roll.left.left).toBeRoll({ number: 2, sides: 20 })
        expect(roll.left.right).toBeRoll({ number: 3, sides: 4 })
        expect(roll.right.value).toEqual(1)
      })

      return rollPromise
    })

    it.only('should roll string correctly', () => {
      const rollPromise = Parser.Parse('2d20+1+20d20k5+4') 

      rollPromise.then(roll => {
        // the roll should be a MathDie
        console.log(roll.toString(true))
      })

      return rollPromise
    })
  })
})
