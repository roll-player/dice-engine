import Parser from '../src/parser'

describe('Parser', () => {
  describe('Single Rolls', () => {
    it('should handle a single Die', () => {
      const dice = Parser.getDice('d20')

      expect(dice.numer).toEqual(1);
      expect(dice.sides).toEqual(20);
    })
  })
})
