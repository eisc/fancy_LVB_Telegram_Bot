/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */
const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const sut = rewire('../../../app/handler/station');
const dummyStops = getDummyStops()
const dataPromise = Promise.resolve(dummyStops)

describe('test station handler', () => {
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
        }
        mockGtfsHelper(dataPromise);
    });

    afterEach(() => {
        sinon.restore()
    });

    describe('test handlePotentialStation', () => {

        it('complete chain is called for given station name', () => {
            const stationName = 'myStationName'
            const matchingStations = getDummyMatchingStations()
            const stationsHelper = mockStationsHelper(matchingStations);
            const getMatchingStationsSpy = sinon.spy(stationsHelper, 'getMatchingStations')
            const handleMatchingStationsSpy = sinon.spy(stationsHelper, 'handleMatchingStations')
            const departureHelper = mockDepartureHelper();
            const getDeparturesForStationSpy = sinon.spy(departureHelper, 'getDeparturesForStation')

            sut.handlePotentialStation(bot, msg, [stationName])

            return assertMembersOfChainAreCalled(dataPromise, getMatchingStationsSpy, stationName, 
                handleMatchingStationsSpy, bot, msg, matchingStations, sendMessageSpy, myChatId, 
                getDeparturesForStationSpy)
        });
    });
});

function getDummyMatchingStations() {
    return [
        { name: 'myStationName 1' },
        { name: 'myStationName 2' }
    ];
}

function getDummyStops() {
    return [
        { name: 'myStationName 1' },
        { name: 'myStationName 2' },
        { name: 'myOtherStationName 3' }
    ];
}

function assertMembersOfChainAreCalled(dataPromise, getMatchingStationsSpy, stationName, 
        handleMatchingStationsSpy, bot, msg, matchingStations, sendMessageSpy, myChatId, 
        getDeparturesForStationSpy) {
    return dataPromise.then((dat) => {
        expect(dat).to.be.equal(dummyStops)
        assertGetMatchingStationsCall(getMatchingStationsSpy, stationName);
        return Promise.resolve(matchingStations)
    }).then((matchingStops) => {
        expect(matchingStops).to.be.equal(matchingStations)
        const passedFunction = assertHandleMatchingStationsCall(handleMatchingStationsSpy, 
            bot, msg, matchingStops, stationName);
        passedFunction(bot, msg, matchingStations[0]);
        assertPassedFunctionCall(sendMessageSpy, myChatId, getDeparturesForStationSpy, 
            bot, msg, matchingStations);
    });
}

function assertPassedFunctionCall(sendMessageSpy, myChatId, getDeparturesForStationSpy, bot, 
        msg, matchingStations) {
    const botCall = sendMessageSpy.getCall(0);
    expect(botCall.args[0]).to.be.equal(myChatId);
    expect(botCall.args[1]).to.be.equal('Das sind die nächsten Abfahrten für myStationName 1:');
    const departCall = getDeparturesForStationSpy.getCall(0);
    expect(departCall.args[0]).to.be.equal(bot);
    expect(departCall.args[1]).to.be.equal(msg);
    expect(departCall.args[2]).to.be.equal(matchingStations[0]);
}

function mockDepartureHelper() {
    const departureHelper = {
        getDeparturesForStation: () => null
    };
    sut.__set__('departureHelper', departureHelper);
    return departureHelper;
}

function assertHandleMatchingStationsCall(handleMatchingStationsSpy, bot, msg, 
        matchingStations, stationName) {
    const handleCall = handleMatchingStationsSpy.getCall(0);
    expect(handleCall.args[0]).to.be.equal(bot);
    expect(handleCall.args[1]).to.be.equal(msg);
    //expect(handleCall.args[2]).to.be.equal(matchingStations);
    expect(handleCall.args[3]).to.be.equal(stationName);
    const passFun = handleCall.args[4];
    return passFun;
}

function assertGetMatchingStationsCall(getMatchingStationsSpy, stationName) {
    const matchingCall = getMatchingStationsSpy.getCall(0);
    expect(matchingCall.args[0]).to.be.equal(dummyStops);
    expect(matchingCall.args[1]).to.be.equal(stationName);
}

function mockStationsHelper(matchingStations) {
    const stationsHelper = {
        getMatchingStations: () => null,
        handleMatchingStations: () => matchingStations
    };
    sut.__set__('stationsHelper', stationsHelper);
    return stationsHelper;
}

function mockGtfsHelper(data) {
    const gtfsHelper = {
        fetchAllStops: () => data
    };
    sut.__set__('gtfsHelper', gtfsHelper);
    return gtfsHelper;
}
