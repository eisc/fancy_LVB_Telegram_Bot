const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const sut = rewire('../../../app/helper/departure.js');
/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */
const handleDeparture = sut.handleDeparture
const getSliceMax = sut.__get__('getSliceMax')
const moreQuery = sut.__get__('moreQuery')

describe('test departure', () => {
  var tableHelper = null;

  beforeEach(() => {
    tableHelper = {
      createAnswerForDepartureResult: () => null,
      departureTable: () => null
    }
    sut.__set__('tableHelper', tableHelper)
  })

  afterEach(() => {
    sut.__set__('fixedDate', null)
  })

  describe('test handleDeparture', () => {
    var bot = null;
    var sendMessageSpy = null;
    var msg = null;
    const myChatId = 'myChatId'

    beforeEach(() => {
      bot = {
      sendMessage: () => null,
      once: () => null,
      answerCallbackQuery: () => null
      };
      sendMessageSpy = sinon.spy(bot, 'sendMessage');
      msg = {
      chat: {
        id: myChatId
      }
      };
    });

    afterEach(() => {
      sinon.restore()
    });

    it('should ignore empty departure result', () => {
      const stationName = 'MyStation'
      const station = {
        name: stationName
      };
      const departureResults = []

      handleDeparture(bot, msg, station, departureResults)

      const call = sendMessageSpy.getCall(0);
      expect(call).to.be.null;
    });

    it('should handle empty departure table', () => {
      const stationName = 'MyStation'
      const station = {
        name: stationName
      };
      const departureResults = [{
        line: {
          id: 'id',
          direction: 'dir'
        },
        timetable: []
      }]
      sinon.stub(tableHelper, 'createAnswerForDepartureResult')
        .withArgs(departureResults).returns([])

      handleDeparture(bot, msg, station, departureResults)

      const call = sendMessageSpy.getCall(0);
      expect(call.args[0]).to.equal(myChatId);
      expect(call.args[1]).eq('Keine aktuellen Abfahrten für *MyStation* gefunden.');
    });

    it('should display existing departures', () => {
      const station = {
        name: 'MyStation'
      };
      const departureResults = [
        getResult1('MyLine1', 'MyLineDirection1'),
        getResult2('MyLine2', 'MyLineDirection2')
      ];
      const answer = [
        getResult1Answer('MyLine1', 'MyLineDirection1'),
        getResult2Answer('MyLine2', 'MyLineDirection2')
      ];
      sinon.stub(tableHelper, 'createAnswerForDepartureResult')
        .withArgs(departureResults).returns(answer)
      const tableStr = 'tableStr'
      sinon.stub(tableHelper, 'departureTable')
        .withArgs(station, answer).returns(tableStr)

      handleDeparture(bot, msg, station, departureResults)

      assertAnswer(sendMessageSpy, myChatId, tableStr, 0);
    });

    it('should display "more button" when more than 10 departures', () => {
      const station = { name: 'MyStation' };
      const { results, all, block1, block2 } = getResultsAndAnswers()
      const { tableStr, tableStr2, botOnceSpy, botAnswerSpy } = stubMultipleCalls(
        bot, tableHelper, results, all, station, block1, block2);
      handleDeparture(bot, msg, station, results)
      assertAnswer(sendMessageSpy, myChatId, tableStr, 0);
      assertOnceCall(botOnceSpy, 0, 10, botAnswerSpy);
      assertAnswer(sendMessageSpy, myChatId, tableStr2, 1);
      expect(botOnceSpy.getCall(1)).to.be.null
    });
  });

  describe('test getSliceMax', () => {
    it('should return 2 as max when slice start 0, slice size 2 and list length is 3', () => {
      const departures = ['1',
        '2',
        '3'];
      const sliceMin = 0;
      const sliceSize = 2;
      const sliceMax = getSliceMax(departures, sliceMin, sliceSize)
      expect(sliceMax).to.be.equal(2)
    })

    it('should return 3 as max when slice start 1, slice size 2 and list length is 3', () => {
      const departures = ['1',
        '2',
        '3'];
      const sliceMin = 1;
      const sliceSize = 2;
      const sliceMax = getSliceMax(departures, sliceMin, sliceSize)
      expect(sliceMax).to.be.equal(3)
    })

    it('should return 3 as max when slice start 2, slice size 2 and list length is 3', () => {
      const departures = ['1',
        '2',
        '3'];
      const sliceMin = 2;
      const sliceSize = 2;
      const sliceMax = getSliceMax(departures, sliceMin, sliceSize)
      expect(sliceMax).to.be.equal(3)
    })

    it('should return 3 as max when slice start 1, slice size 3 and list length is 3', () => {
      const departures = ['1',
        '2',
        '3'];
      const sliceMin = 1;
      const sliceSize = 3;
      const sliceMax = getSliceMax(departures, sliceMin, sliceSize)
      expect(sliceMax).to.be.equal(3)
    })
  });

  describe('test moreQuery', () => {
    it('should show "more" button when slice is lower list size', () => {
      const departures = ['1',
        '2',
        '3'];
      const sliceMax = 2;
      const result = moreQuery(departures, sliceMax)
      const expectedResult = {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [[{
            text: 'mehr anzeigen',
            callback_data: 'more_departures_2'
          }]]
        }
      }
      expect(result).to.deep.eql(expectedResult)
    })

    it('should show no button when slice is equal list size', () => {
      const departures = ['1',
        '2',
        '3'];
      const sliceMax = 3;
      const result = moreQuery(departures, sliceMax)
      const expectedResult = { parse_mode: 'Markdown' }
      expect(result).to.deep.eql(expectedResult)
    })

    it('should show no button when slice is greater than list size', () => {
      const departures = ['1',
        '2',
        '3'];
      const sliceMax = 4;
      const result = moreQuery(departures, sliceMax)
      const expectedResult = { parse_mode: 'Markdown' }
      expect(result).to.deep.eql(expectedResult)
    })
  });
});

function stubMultipleCalls(bot, tableHelper, results, all, station, block1, block2) {
  const botOnceSpy = sinon.spy(bot, 'once')
  const botAnswerSpy = sinon.spy(bot, 'answerCallbackQuery')
  sinon.stub(tableHelper, 'createAnswerForDepartureResult')
    .withArgs(results).returns(all);
  const tableStr = 'tableStr1';
  const tableStr2 = 'tableStr2';
  sinon.stub(tableHelper, 'departureTable')
    .withArgs(station, block1).returns(tableStr)
    .withArgs(station, block2).returns(tableStr2);
  return { tableStr, tableStr2, botOnceSpy, botAnswerSpy };
}

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

function getResult1Answer(lineId, lineDirection) {
  return [[lineId,
    lineDirection,
    '',
    ' +3'
  ],
  [lineId,
    lineDirection,
    20,
    ''
  ]]
}

function getResult2(lineId, lineDirection) {
  return {
    line: {
      id: lineId,
      direction: lineDirection
    },
    timetable: [
      {
        departure: '2018-12-25T21:55:00.000+0100',
        departureDelay: 0
      }
    ]
  };
}

function getResult2Answer(lineId, lineDirection) {
  return [[lineId,
    lineDirection,
    25,
    ''
  ]]
}

function getResultsAndAnswers() {
  const departureResults = []
  const answer = []
  for(var counter = 0; counter < 15; counter += 1) {
    departureResults.push(getResult1('MyLine' + counter, 'MyLineDirection' + counter))
    answer.push(getResult1('MyLine' + counter, 'MyLineDirection' + counter))
  }
  return {
    results: departureResults,
    all: answer,
    block1: answer.slice(0, 10),
    block2: answer.slice(10, 15)
  }
}

function assertAnswer(sendMessageSpy, myChatId, expectedAnswer, callIndex) {
  const call = sendMessageSpy.getCall(callIndex);
  expect(call.args[0]).to.equal(myChatId);
  expect(call.args[1]).eq(expectedAnswer);
}

function assertOnceCall(botOnceSpy, callIndex, max, botAnswerSpy) {
  const call = botOnceSpy.getCall(callIndex);
  expect(call.args[0]).to.equal('callback_query');
  const fun = call.args[1]
  const queryId = 'queryId'
  const query = {
    id: queryId,
    data: 'more_departures_' + max
  }
  fun(query)
  const answerCall = botAnswerSpy.getCall(0);
  expect(answerCall.args[0]).eq(queryId);
}