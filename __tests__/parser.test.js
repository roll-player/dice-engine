import Parser from '../src/parser'

describe('Parser', () => {
  describe('Single Rolls', () => {
    it('should handle a single Die', () => {
      const dice = Parser.parse('d20')

      console.log(dice)
    })
  })
})
