const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const sut = rewire('../../../app/helper/departure_lvb.js');
/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */
const departureHelper = {
  handleDeparture: () => null
}
const commonHelper = {
  normalizeStationId: () => null
}
const lvb = {
  departures: () => null
};

describe('test LVB library based departure calculation', () => {

  describe('test getDeparturesForStation', () => {
    var bot = null;
    var sendMessageSpy = null;
    var msg = null;
    const myChatId = 'myChatId'
    const myStation = {
      id: 'myStationId',
      name: 'myStationName'
    };

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
      }
      sut.__set__('lvb', lvb);
      sut.__set__('departureHelper', departureHelper)
      sut.__set__('commonStationHelper', commonHelper)
    });

    afterEach(() => {
      sinon.restore()
    });

    it('should call handleDeparture for found departures', () => {
      const departure = { dummy: 'dummy1' };
      const departures = [departure]
      const departurePromise = Promise.resolve(departures)

      const lvbStub = sinon.stub(lvb, 'departures');
      lvbStub.returns(departurePromise)
      const normalizeStationIdSpy = sinon.stub(commonHelper, 'normalizeStationId')
      normalizeStationIdSpy.returns('myStationId')
      const handleDepartureSpy = sinon.stub(departureHelper, 'handleDeparture')

      sut.getDeparturesForStation(bot, msg, myStation)

      return departurePromise.then(() => {
        expect(normalizeStationIdSpy.getCall(0).args[0]).to.be.equal('myStationId')
        assertHandleDepartureCall(0, handleDepartureSpy, bot, msg, myStation, departures);
      })
    });

    it('should catch error of remote API call', () => {
      const errorMessage = 'myErrorMessage'

      const lvbStub = sinon.stub(lvb, 'departures');
      lvbStub.throws(new Error(errorMessage));
      const normalizeStationIdSpy = sinon.stub(commonHelper, 'normalizeStationId')
      normalizeStationIdSpy.returns('myStationId')
      const handleDepartureSpy = sinon.stub(departureHelper, 'handleDeparture')

      sut.getDeparturesForStation(bot, msg, myStation)

      assertErrorCatched(normalizeStationIdSpy, handleDepartureSpy, sendMessageSpy, myChatId);
    });
  });

  function assertErrorCatched(normalizeStationIdSpy, handleDepartureFake, sendMessageSpy, myChatId) {
    expect(normalizeStationIdSpy.getCall(0).args[0]).to.be.equal('myStationId');
    expect(handleDepartureFake.getCall(0)).to.be.null;
    expect(sendMessageSpy.getCall(0).args[0]).to.be.equal(myChatId);
    expect(sendMessageSpy.getCall(0).args[1]).to.be.equal('Fehler myErrorMessage');
  }

  function assertHandleDepartureCall(callIndex, handleDepartureSpy, bot, msg, station, departures) {
    const depCall = handleDepartureSpy.getCall(callIndex);
    expect(depCall.args[0]).to.be.equal(bot);
    expect(depCall.args[1]).to.be.equal(msg);
    expect(depCall.args[2]).to.be.equal(station);
    expect(depCall.args[3]).to.be.deep.equal(departures);
  }
});


