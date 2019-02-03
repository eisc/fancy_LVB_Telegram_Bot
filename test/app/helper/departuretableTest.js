const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const sut = rewire('../../../app/helper/departuretable.js');
/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */
const createAnswerForDepartureResult = sut.createAnswerForDepartureResult
const departureTable = sut.departureTable
const formattedDepartureMinutesFromNow = sut.__get__('formattedDepartureMinutesFromNow')
const formattedDelayMinutes = sut.__get__('formattedDelayMinutes')

describe('test departure table format', () => {

  describe('test formatted departure result', () => {
    var sortHelper = null;
    var calcHelper = null;

    beforeEach(() => {
      sortHelper = {
        compareDepartureEntries: (input) => input
      }
      calcHelper = {
        calcDepartureMinutesFromNow: () => null,
        calcDelayInMinutes: () => null
      }
      sut.__set__('sortHelper', sortHelper)
      sut.__set__('calcHelper', calcHelper)
    })

    afterEach(() => {
      sinon.restore()
    })

    describe('test createAnswerForDepartureResult', () => {
      it('should return empty list, when line not defined', () => {
        const result = [];
        const answer = createAnswerForDepartureResult(result)
        expect(answer).to.be.empty
      });

      it('should return empty list, when timetable not defined', () => {
        const lineId = '1'
        const lineDirection = 'MyLineDirection'
        const result = [{
          line: {
            id: lineId,
            direction: lineDirection
          },
          timetable: []
        }];
        const answer = createAnswerForDepartureResult(result)
        expect(answer).to.be.empty
      });

      it('should return departure infos as list of lists according to time table', () => {
        const lineId = '1'
        const lineDirection = 'MyLineDirection'
        const result1 = getResult1(lineId, lineDirection)
        const result = [result1];

        sinon.stub(calcHelper, 'calcDepartureMinutesFromNow')
          .withArgs(result1.timetable[0]).returns(0)
          .withArgs(result1.timetable[1]).returns(20);
        sinon.stub(calcHelper, 'calcDelayInMinutes')
          .withArgs(result1.timetable[0]).returns(3)
          .withArgs(result1.timetable[1]).returns(0);

        const answer = createAnswerForDepartureResult(result)
        const expectedAnswer = [[lineId,
          lineDirection,
          '',
          ' +3'],
          [lineId,
            lineDirection,
            20,
            ''
          ]
        ]
        expect(answer).to.deep.eql(expectedAnswer)
      });
    });

    describe('test formattedDepartureMinutesFromNow', () => {
      it('should return empty string for departure now', () => {
        const time = {
          departure: '2018-12-25T21:50:00.000+0100'
        }
        sinon.stub(calcHelper, 'calcDepartureMinutesFromNow')
          .withArgs(time).returns(0)

        const answer = formattedDepartureMinutesFromNow(time)
        expect(answer).to.equal('')
      });

      it('should return number for departure in future', () => {
        const time = {
          departure: '2018-12-25T21:50:00.000+0100'
        }
        sinon.stub(calcHelper, 'calcDepartureMinutesFromNow')
          .withArgs(time).returns(5)

        const answer = formattedDepartureMinutesFromNow(time)
        expect(answer).to.equal(5)
      });

      it('should return number for departure in past', () => {
        const time = {
          departure: '2018-12-25T21:50:00.000+0100'
        }
        sinon.stub(calcHelper, 'calcDepartureMinutesFromNow')
          .withArgs(time).returns(-5)

        const answer = formattedDepartureMinutesFromNow(time)
        expect(answer).to.equal(-5)
      });
    });
    describe('test formattedDelayMinutes', () => {
      it('should return empty string for delay zero', () => {
        const time = {
          departureDelay: 0
        }
        sinon.stub(calcHelper, 'calcDelayInMinutes')
          .withArgs(time).returns(0)

        const answer = formattedDelayMinutes(time)
        expect(answer).to.equal('')
      });

      it('should return plus signed number for departure in future', () => {
        const time = {
          departureDelay: 300000
        }
        sinon.stub(calcHelper, 'calcDelayInMinutes')
          .withArgs(time).returns(5)

        const answer = formattedDelayMinutes(time)
        expect(answer).to.equal(' +5')
      });

      it('should return minus signed number for departure in past', () => {
        const time = {
          departureDelay: -300000
        }
        sinon.stub(calcHelper, 'calcDelayInMinutes')
          .withArgs(time).returns(-5)

        const answer = formattedDelayMinutes(time)
        expect(answer).to.equal(' -5')
      });
    });
  });

  describe('test departureTable', () => {

    it('should return correctly spaced table', () => {
      const station = {
        name: 'MyStation'
      };
      const answer = [['1',
        'Direction 1',
        '',
        ' +3'],
        ['1',
          'Direction 1',
          20,
          ''
        ]
      ]
      const result = departureTable(station, answer)
      expect(result).to.equal('Abfahrten für *MyStation*\n`1  Direction 1       +3\n1  Direction 1  20`')
    });
  });
});

function getResult1(lineId, lineDirection) {
  return {
    line: {
      id: lineId,
      direction: lineDirection
    },
    timetable: [
      {
        departure: '2018-12-25T21:33:15.050+0100',
        departureDelay: 180000
      },
      {
        departure: '2018-12-25T21:50:00.000+0100',
        departureDelay: 0
      }
    ]
  };
}