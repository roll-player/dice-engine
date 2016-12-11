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
      }).catch(err => console.error(err))

      return rollPromise
    })

    it('should handle a defined number of dice', () => {
      const rollPromise = Parser.Parse('2d20')

      rollPromise.then(roll => {
        expect(roll).toBeRoll({ number: 2, sides: 20 })
      }).catch(err => console.error(err))


      return rollPromise
    })

    it('should handle keeps', () => {
      const rollPromise = Parser.Parse('4d6k3')

      rollPromise.then(roll => {
        expect(roll).toHaveDice({totalRolled: 4, dropped: 1, valid: 3})
      }).catch(err => console.error(err))


      return rollPromise
    })

    it('should handle drops', () => {
      const rollPromise = Parser.Parse('4d6v1')

      rollPromise.then(roll => {
        expect(roll).toHaveDice({ totalRolled: 4, dropped: 1, valid: 3})
      }).catch(err => console.error(err))


      return rollPromise
    })

    it('should handle rerolls', () => {
      const rollPromise = Parser.Parse('4d6r1')

      rollPromise.then(roll => {
        expect(roll).toHaveDice({ valid: 4})
      }).catch(err => console.error(err))


      return rollPromise
    })
  })

  describe('Combined Rolls', () => {
    it('should add modifiers to the roll', () => {
      const rollPromise = Parser.Parse('2d20+1') 

      rollPromise.then(roll => {
        expect(roll.__values__[0].value).toBeRoll({ number: 2, sides: 20 })
        expect(roll.__values__[1].value).toEqual({ value: 1 })
        expect(roll.__values__[1].operation).toEqual('+')
      }).catch(err => console.error(err))


      return rollPromise
    })

    it('should handle multiple operators', () => {
      const rollPromise = Parser.Parse('2d20+3d4+1') 

      rollPromise.then(roll => {
        // the roll should be a MathDie
        expect(roll).toBeInstanceOf(MathDie)
        expect(roll.input).toEqual('2d20+3d4+1')
      }).catch(err => console.error(err))


      return rollPromise
    })
  })
})
