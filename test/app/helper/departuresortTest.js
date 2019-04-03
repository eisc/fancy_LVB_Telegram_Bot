const expect = require('chai').expect;
const rewire = require('rewire');
const sut = rewire('../../../app/helper/departuresort.js');
/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */
const compareDepartureEntries = sut.compareDepartureEntries
const compareStrings = sut.__get__('compareStrings')
const compareDepartures = sut.__get__('compareDepartures')
const totalDeparture = sut.__get__('totalDeparture')

describe('test departure sorting', () => {

  describe('test compareDepartureEntries', () => {
    it('should sort correctly by line when total departure is identical', () => {
      const entry1 = ['Linie 1',
        'Direction 1',
        '1',
        ' +2']
      const entry2 = ['Linie 2',
        'Direction 2',
        '2',
        ' +1']
      const expectedCompareResult = -1
      expect(compareDepartureEntries(entry1, entry2)).to.equal(expectedCompareResult)
    });

    it('should sort correctly by direction when line and total departure is identical', () => {
      const entry1 = ['Linie 1',
        'Direction 2',
        '1',
        ' +2']
      const entry2 = ['Linie 1',
        'Direction 1',
        '2',
        ' +1']
      const expectedCompareResult = 1
      expect(compareDepartureEntries(entry1, entry2)).to.equal(expectedCompareResult)
    });

    it('should sort correctly by total departure', () => {
      const entry1 = ['Linie 1',
        'Direction 1',
        '1',
        ' +2']
      const entry2 = ['Linie 1',
        'Direction 1',
        '2',
        ' +2']
      const expectedCompareResult = -1
      expect(compareDepartureEntries(entry1, entry2)).to.equal(expectedCompareResult)
    });

    it('should sort by order passed in when all identical', () => {
      const entry1 = ['Linie 1',
        'Direction 1',
        '1',
        ' +2']
      const entry2 = ['Linie 1',
        'Direction 1',
        '1',
        ' +2']
      const expectedCompareResult = -1
      expect(compareDepartureEntries(entry1, entry2)).to.equal(expectedCompareResult)
    });
  });

  describe('test compareDepartures', () => {
    it('should return -1 when strings alphanumeric in order', () => {
      const departure1 = 2
      const delay1 = ' +1'
      const departure2 = 1
      const delay2 = ' +3'
      const expectedCompareResult = -1
      expect(compareDepartures(departure1, delay1, departure2, delay2, () => -2))
        .to.equal(expectedCompareResult)
    });

    it('should return 1 when strings alphanumeric in reversed order', () => {
      const departure1 = 5
      const delay1 = ' +1'
      const departure2 = 1
      const delay2 = ' +3'
      const expectedCompareResult = 2
      expect(compareDepartures(departure1, delay1, departure2, delay2, () => -2))
        .to.equal(expectedCompareResult)
    });

    it('should return passed function result when strings alphanumeric identical', () => {
      const departure1 = 2
      const delay1 = ' +2'
      const departure2 = 1
      const delay2 = ' +3'
      const expectedCompareResult = -2
      expect(compareDepartures(departure1, delay1, departure2, delay2, () => -2))
        .to.equal(expectedCompareResult)
    });
  });

  describe('test compareStrings', () => {
    it('should return -1 when strings alphanumeric in order', () => {
      const string1 = 'Line 1'
      const string2 = 'Line 2'
      const expectedCompareResult = -1
      expect(compareStrings(string1, string2, () => -2)).to.equal(expectedCompareResult)
    });

    it('should return 1 when strings alphanumeric in reversed order', () => {
      const string1 = 'Line 2'
      const string2 = 'Line 1'
      const expectedCompareResult = 1
      expect(compareStrings(string1, string2, () => -2)).to.equal(expectedCompareResult)
    });

    it('should return passed function result when strings alphanumeric identical', () => {
      const string1 = 'Line 1'
      const string2 = 'Line 1'
      const expectedCompareResult = -2
      expect(compareStrings(string1, string2, () => -2)).to.equal(expectedCompareResult)
    });
  });

  describe('test totalDeparture', () => {
    it('should calculate sum of departure minutes and delay minutes', () => {
      const departure = 3
      const delay = ' +1'
      const expectedTotal = 4
      expect(totalDeparture(departure, delay)).to.equal(expectedTotal)
    });

    it('should return delay minutes as total when departure is empty', () => {
      const departure = ''
      const delay = ' +1'
      const expectedTotal = 1
      expect(totalDeparture(departure, delay)).to.equal(expectedTotal)
    });

    it('should return departure minutes as total when delay is empty', () => {
      const departure = 3
      const delay = ''
      const expectedTotal = 3
      expect(totalDeparture(departure, delay)).to.equal(expectedTotal)
    });
  });
});