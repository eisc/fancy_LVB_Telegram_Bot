/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */
const expect = require('chai').expect;
const moment = require('moment')
const rewire = require('rewire');
const sut = rewire('../../../app/helper/departurecalc.js');
const calcDepartureMinutesFromNow = sut.calcDepartureMinutesFromNow
const calcDelayInMinutes = sut.calcDelayInMinutes

describe('test departure calculation', () => {

  beforeEach(() => {
    sut.__set__('fixedDate', moment('2018-12-25T21:31:43.000+0100'))
  })

  afterEach(() => {
    sut.__set__('fixedDate', null)
  })

  describe('test calcDepartureMinutesFromNow', () => {

    it('should return rounded difference in minutes from reference to departure in future', () => {
      const time = {
        departure: '2018-12-25T21:33:15.050+0100'
      };
      const answer = calcDepartureMinutesFromNow(time)
      const expectedAnswer = 1
      expect(answer).to.equal(expectedAnswer)
    });

    it('should return difference zero when reference to departure difference is between 0 and 1', () => {
      const time = {
        departure: '2018-12-25T21:32:15.050+0100'
      };
      const answer = calcDepartureMinutesFromNow(time)
      const expectedAnswer = 0
      expect(answer).to.equal(expectedAnswer)
    });

    it('should return rounded negative difference in minutes from reference to departure in past', () => {
      const time = {
        departure: '2018-12-25T21:30:15.050+0100'
      };
      const answer = calcDepartureMinutesFromNow(time)
      const expectedAnswer = -2
      expect(answer).to.equal(expectedAnswer)
    });
  });

  describe('test calcDelayInMinutes', () => {

    it('should return positive delay rounded to minutes', () => {
      const time = {
        departureDelay: 180000
      };
      const answer = calcDelayInMinutes(time)
      const expectedAnswer = 3
      expect(answer).to.equal(expectedAnswer)
    });

    it('should return zero when delay is between 0 and 1 minutes', () => {
      const time = {
        departureDelay: 50000
      };
      const answer = calcDelayInMinutes(time)
      const expectedAnswer = 0
      expect(answer).to.equal(expectedAnswer)
    });

    it('should return rounded negative delay in minutes', () => {
      const time = {
        departureDelay: -180000
      };
      const answer = calcDelayInMinutes(time)
      const expectedAnswer = -3
      expect(answer).to.equal(expectedAnswer)
    });
  });
});