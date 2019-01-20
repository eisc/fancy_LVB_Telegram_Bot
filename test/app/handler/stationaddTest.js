/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */
const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const sut = rewire('../../../app/handler/stationadd');
const dummyStops = getDummyStops()
const dataPromise = Promise.resolve(dummyStops)
const expectedStation = {
    id: 'myStationId 1',
    name: 'myStationName 1'
}

describe('test stationadd handler', () => {
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

    describe('test handleCommandAdd', () => {

        it('early abort when empty station name passed in', () => {
            sut.handleCommandAdd(bot, msg, [
                'a',
                'b',
                ''
            ])

            const botCall = sendMessageSpy.getCall(0);
            expect(botCall.args[0]).to.be.equal(myChatId);
            expect(botCall.args[1]).to.be.equal('Bitte gib eine Haltestelle ein.');
        });

        it('complete chain is called for given station name', () => {
            const stationName = 'myStationName'
            const matchingStations = getDummyMatchingStations()
            const stationsHelper = mockStationsHelper(matchingStations);
            const getMatchingStationsSpy = sinon.spy(stationsHelper, 'getMatchingStations')
            const handleMatchingStationsSpy = sinon.spy(stationsHelper, 'handleMatchingStations')
            const expectedKeyboard = {
                'keybaordDummy': 'keybaordDummy'
            }
            const globalStationsHelper = mockGlobalStationsHelper(false, expectedKeyboard);
            const addGlobalStationSpy = sinon.spy(globalStationsHelper, 'addGlobalStation')

            sut.handleCommandAdd(bot, msg, [
                'a',
                'b',
                stationName
            ])

            return assertMembersOfChainAreCalled(dataPromise, getMatchingStationsSpy, stationName,
                handleMatchingStationsSpy, bot, msg, matchingStations, sendMessageSpy, myChatId,
                addGlobalStationSpy, expectedKeyboard)
        });
    });

    describe('test handleMatchingStation', () => {

        it('when matched station is already contained in global stations, its not added again', () => {
            const expectedKeyboard = {
                'keybaordDummy': 'keybaordDummy'
            }
            const globalStationsHelper = mockGlobalStationsHelper(true, expectedKeyboard);
            const addGlobalStationSpy = sinon.spy(globalStationsHelper, 'addGlobalStation')

            const handleMatchingStation = sut.__get__('handleMatchingStation');
            handleMatchingStation(bot, msg, expectedStation)

            assertAddGlobalStationNotCalled(sendMessageSpy, myChatId, addGlobalStationSpy);
        });
    });
});

function getDummyMatchingStations() {
    return [
        {
            id: 'myStationId 1',
            name: 'myStationName 1'
        },
        {
            id: 'myStationId 2',
            name: 'myStationName 2'
        }
    ];
}

function getDummyStops() {
    return [
        {
            id: 'myStationId 1',
            name: 'myStationName 1'
        },
        {
            id: 'myStationId 2',
            name: 'myStationName 2'
        },
        {
            id: 'myOtherStationId 3',
            name: 'myOtherStationName 3'
        }
    ];
}

function assertMembersOfChainAreCalled(dataPromise, getMatchingStationsSpy, stationName,
        handleMatchingStationsSpy, bot, msg, matchingStations, sendMessageSpy, myChatId,
        addGlobalStationSpy, expectedKeyboard) {
    return dataPromise.then((dat) => {
        expect(dat).to.be.equal(dummyStops)
        assertGetMatchingStationsCall(getMatchingStationsSpy, stationName);
        return Promise.resolve(matchingStations)
    }).then((matchingStops) => {
        expect(matchingStops).to.be.equal(matchingStations)
        const passedFunction = assertHandleMatchingStationsCall(handleMatchingStationsSpy,
            bot, msg, matchingStops, stationName);
        passedFunction(bot, msg, matchingStations[0]);
        assertPassedFunctionCall(sendMessageSpy, myChatId,
            addGlobalStationSpy, expectedKeyboard);
    });
}

function assertPassedFunctionCall(sendMessageSpy, myChatId,
        addGlobalStationSpy, expectedKeyboard) {
    const addCall = addGlobalStationSpy.getCall(0);
    expect(addCall.args[0]).to.be.eql(expectedStation);
    const botCall = sendMessageSpy.getCall(0);
    expect(botCall.args[0]).to.be.equal(myChatId);
    expect(botCall.args[1]).to.be.equal('myStationName 1 wurde hinzugefügt.');
    expect(botCall.args[2]).to.be.equal(expectedKeyboard);
}

function assertAddGlobalStationNotCalled(sendMessageSpy, myChatId,
    addGlobalStationSpy) {
    const addCall = addGlobalStationSpy.getCall(0);
    expect(addCall).to.be.null;
    const botCall = sendMessageSpy.getCall(0);
    expect(botCall.args[0]).to.be.equal(myChatId);
    expect(botCall.args[1]).to.be.equal('myStationName 1 steht bereits auf der Liste.');
    expect(botCall.args[2]).to.be.undefined;
}

function mockGlobalStationsHelper(isContainedInGlobalStations, expectedKeyboard) {
    const globalStationsHelper = {
        containedInGlobalStations: () => isContainedInGlobalStations,
        addGlobalStation: () => () => null,
        globalStationsAsKeyboard: () => expectedKeyboard
    };
    sut.__set__('globalStationsHelper', globalStationsHelper);
    return globalStationsHelper;
}

function assertHandleMatchingStationsCall(handleMatchingStationsSpy, bot, msg,
        matchingStations, stationName) {
    const handleCall = handleMatchingStationsSpy.getCall(0);
    expect(handleCall.args[0]).to.be.equal(bot);
    expect(handleCall.args[1]).to.be.equal(msg);
    // expect(handleCall.args[2]).to.be.equal(matchingStations);
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
