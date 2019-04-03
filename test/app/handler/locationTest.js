/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */
const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const sut = rewire('../../../app/handler/location.js');
const myChatId = 'myChatId'

describe('test location handler', () => {
  var bot = null;
  var sendMessageSpy = null;
  var predefinedMsg = null;
  var gtfsHelperStub = null
  var stationHelperStub = null

  beforeEach(() => {
    bot = {
      sendMessage: () => null,
      once: () => null,
      answerCallbackQuery: () => null
    };
    sendMessageSpy = sinon.spy(bot, 'sendMessage');
    predefinedMsg = {
      chat: {
        id: myChatId
      }
    };
    gtfsHelperStub = {
      fetchAllStops: () => null
    }
    stationHelperStub = {
      handleMatchingStation: () => null
    }
    sut.__set__('gtfsHelper', gtfsHelperStub)
    sut.__set__('stationHelper', stationHelperStub)
  });

  afterEach(() => {
    sinon.restore()
  });

  describe('test handleCommandLocation', () => {
    it('test distance calculation', () => {
      const testStations = getTestStations()
      const msg = getMsgWithPosition(predefinedMsg)
      const fetchPromise = Promise.resolve(testStations)
      sinon.stub(gtfsHelperStub, 'fetchAllStops').returns(fetchPromise);
      const onceSpy = sinon.spy(bot, 'once');
      const answerCallbackQuerySpy = sinon.spy(bot, 'answerCallbackQuery');
      const keyboardEntries = getExpectedKeyboardEntries()
      const handleMatchingStationFunFake = sinon.spy(stationHelperStub, 'handleMatchingStation')
      sut.handleCommandLocation(bot, msg)
      return fetchPromise.then(data => {
        expect(data).to.eql(testStations)
        assertAnswerForMultipleStation(sendMessageSpy, onceSpy, bot, msg,
          handleMatchingStationFunFake, answerCallbackQuerySpy, keyboardEntries)
      })
    });
  });
});

function getMsgWithPosition(msg) {
  const position = {
    latitude: 51.33104066938517,
    longitude: 12.37386703491211
  }
  return {
    ...msg,
    location: position
  }
}

function getTestStations() {
  return [
    {
      id: '0001',
      name: 'Münzgasse',
      lon: 12.373695373535156,
      lat: 51.33246180817414
    },
    {
      id: '0002',
      name: 'Bayrischer Bahnhof',
      lon: 12.38086223602295,
      lat: 51.3307993395554
    },
    {
      id: '0003',
      name: 'Wilhelm-Leuschner-Platz',
      lon: 12.375197410583494,
      lat: 51.335732941388294
    },
    {
      id: '0004',
      name: 'Arena',
      lon: 12.356829643249512,
      lat: 51.341818773042775
    },
    {
      id: '0005',
      name: 'Westplatz',
      lon: 12.362408638000488,
      lat: 51.33897703150613
    },
    {
      id: '0006',
      name: 'Kurt-Eisner-Straße',
      lon: 12.373502254486084,
      lat: 51.320662339701364
    }
  ]
}

function getExpectedKeyboardEntries() {
  return [
    [{
      text: 'Münzgasse (91m)',
      callback_data: '0001'
    }],
    [{
      text: 'Bayrischer Bahnhof (216m)',
      callback_data: '0002'
    }],
    [{
      text: 'Wilhelm-Leuschner-Platz (302m)',
      callback_data: '0003'
    }],
    [{
      text: 'Westplatz (615m)',
      callback_data: '0005'
    }],
    [{
      text: 'Kurt-Eisner-Straße (661m)',
      callback_data: '0006'
    }]
  ]
}

function assertAnswerForMultipleStation(sendMessageSpy, onceSpy, bot, msg,
  handleMatchingStationFunFake, answerCallbackQuerySpy, keyboardEntries) {
  const call = sendMessageSpy.getCall(0);
  expect(call.args[0]).to.equal(myChatId);
  const expectedAnswer = 'Danke. Das sind die nächsten 5 Haltestellen:'
  expect(call.args[1]).eq(expectedAnswer);
  const expectedKeyboard = {
    reply_markup: {
      inline_keyboard: keyboardEntries
    }
  }
  expect(call.args[2]).to.deep.eql(expectedKeyboard);
  const onceCall = onceSpy.getCall(0);
  expect(onceCall.args[0]).to.equal('callback_query');
  const queryFun = onceCall.args[1];
  assertQueryAfterMultipleSelection(bot, msg,
    handleMatchingStationFunFake, queryFun, answerCallbackQuerySpy)
}

function assertQueryAfterMultipleSelection(bot, msg,
  handleMatchingStationFunFake, queryFun, answerCallbackQuerySpy) {
  queryFun({
    id: 'myQueryId',
    data: '0001'
  })
  const callbackCall = answerCallbackQuerySpy.getCall(0);
  expect(callbackCall.args[0]).to.equal('myQueryId');
  assertAnswerForStation(bot, msg, handleMatchingStationFunFake, 0)
}

function assertAnswerForStation(bot, msg, handleMatchingStationFunStub, index) {
  const funCall = handleMatchingStationFunStub.getCall(index);
  expect(funCall.args[0]).to.eql(bot);
  expect(funCall.args[1]).to.eql(msg);
  expect(funCall.args[2]).to.eql({
    id: '0001',
    name: 'Münzgasse',
    lat: 51.33246180817414,
    lon: 12.373695373535156,
    distance: 90.69496452117558
  });
}


