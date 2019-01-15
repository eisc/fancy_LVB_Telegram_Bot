/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */
const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const sut = rewire('../../../app/handler/reset');

describe('test reset handler', () => {
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
    });

    afterEach(() => {
        sinon.restore()
    });

    describe('test handleCommandReset', () => {

        it('when no global stations exist return immediately', () => {
            const globalStationsHelperStub = {
                getGlobalStations: () => []
            };
            sut.__set__('globalStationsHelper', globalStationsHelperStub)

            sut.handleCommandReset(bot, msg)

            const call = sendMessageSpy.getCall(0);
            expect(call.args[0]).to.equal(myChatId);
            expect(call.args[1]).to.equal('Liste ist bereits leer.');
        })

        it('when global stations exist, no station name was passed, and deletion is confirmed, remove all', () => {
            const globalStationsHelperStub = mockGetGlobalsStationsWithTwoStations()
            const selectionSpy = sinon.spy(bot, 'once')
            const callbackSpy = sinon.spy(bot, 'answerCallbackQuery')
            const deleteGlobalStationsSpy = sinon.spy(globalStationsHelperStub, 'deleteGlobalStations')

            sut.handleCommandReset(bot, msg, [])

            assertSecondDeletionQuery(sendMessageSpy, myChatId);
            const queryListener = assertRegistrationOfSelectionListener(selectionSpy)
            assertDeleteAllGlobalStations(queryListener, myChatId, callbackSpy,
                deleteGlobalStationsSpy, sendMessageSpy)
        })

        it('when global stations exist, no station name was passed, and deletion is rejected, remove is not called', () => {
            const globalStationsKeyboardAfter = { dummy: 'dummy' }
            const globalStationsHelperStub = mockGetGlobalsStationsWithTwoStations(globalStationsKeyboardAfter)
            const selectionSpy = sinon.spy(bot, 'once')
            const callbackSpy = sinon.spy(bot, 'answerCallbackQuery')
            const deleteGlobalStationsSpy = sinon.spy(globalStationsHelperStub, 'deleteGlobalStations')

            sut.handleCommandReset(bot, msg, [])

            assertSecondDeletionQuery(sendMessageSpy, myChatId);
            const queryListener = assertRegistrationOfSelectionListener(selectionSpy)
            assertDontDeleteAllWhenRejected(queryListener, myChatId, callbackSpy,
                deleteGlobalStationsSpy, sendMessageSpy)
        })

        it('when global stations exist, station name is given, but doesnt match existing, nothing is deleted', () => {
            const globalStationsKeyboardAfter = { dummy: 'dummy' }
            const globalsStationsHelper = mockGetGlobalsStationsWithTwoStations(globalStationsKeyboardAfter)
            const matching = []
            const stationsHelperStub = createStationsHelperStub(matching);
            const getMatchingStationsSpy = sinon.spy(stationsHelperStub, 'getMatchingStations')
            const handleMatchingStationsSpy = sinon.spy(stationsHelperStub, 'handleMatchingStations')
            const removeFromGlobalStationSpy = sinon.spy(globalsStationsHelper, 'removeFromGlobalStations')

            const searchStr = 'differentStation'
            sut.handleCommandReset(bot, msg, [
                'a',
                'b',
                searchStr])

            assertNoRemove(getMatchingStationsSpy, searchStr, handleMatchingStationsSpy, bot, msg,
                removeFromGlobalStationSpy);
        })

        it('when global stations exist, station name is given, and match existing, this one is deleted', () => {
            const globalStationsKeyboardAfter = { dummy: 'dummy' }
            const globalsStationsHelper = mockGetGlobalsStationsWithTwoStations(globalStationsKeyboardAfter)
            const searchStr = 'exampleStation1'
            const matching = [searchStr]
            const stationsHelperStub = createStationsHelperStub(matching);
            const getMatchingStationsSpy = sinon.spy(stationsHelperStub, 'getMatchingStations')
            const handleMatchingStationsSpy = sinon.spy(stationsHelperStub, 'handleMatchingStations')
            const removeFromGlobalStationSpy = sinon.spy(globalsStationsHelper, 'removeFromGlobalStations')

            sut.handleCommandReset(bot, msg, [
                'a',
                'b',
                searchStr])

            assertRemoveOneStationFromMany(getMatchingStationsSpy,
                searchStr, handleMatchingStationsSpy, bot, msg, myChatId, removeFromGlobalStationSpy,
                globalStationsKeyboardAfter, sendMessageSpy);
        })

        it('when one global station exist, station name is given, and match existing, everything is deleted', () => {
            const globalStationsKeyboardAfter = { dummy: 'dummy' }
            const globalsStationsHelper = mockGetGlobalsStationsWithOneStation(globalStationsKeyboardAfter)
            const stationsHelperStub = createStationsHelperStub([]);
            const getMatchingStationsSpy = sinon.spy(stationsHelperStub, 'getMatchingStations')
            const handleMatchingStationsSpy = sinon.spy(stationsHelperStub, 'handleMatchingStations')
            const deleteGlobalStationsSpy = sinon.spy(globalsStationsHelper, 'deleteGlobalStations')

            const searchStr = 'differentStation'
            sut.handleCommandReset(bot, msg, [
                'a',
                'b',
                searchStr])

            assertRemoveAllAsOnlyOneGlobalStation(getMatchingStationsSpy,
                searchStr, handleMatchingStationsSpy, bot, msg, myChatId,
                deleteGlobalStationsSpy, globalStationsKeyboardAfter,
                sendMessageSpy);
        })

    });
});

function assertRemoveOneStationFromMany(getMatchingStationsSpy,
    searchStr, handleMatchingStationsSpy, bot, msg, myChatId, removeFromGlobalStationsSpy,
    globalStationsKeyboardAfter, sendingMessageSpy) {
    assertGetMatchingStationsCall(getMatchingStationsSpy, searchStr);
    assertHandleMatchingStationsWithFunCall(handleMatchingStationsSpy, bot, msg, searchStr, myChatId,
        sendingMessageSpy, removeFromGlobalStationsSpy, globalStationsKeyboardAfter);
}

function assertRemoveAllAsOnlyOneGlobalStation(getMatchingStationsSpy,
    searchStr, handleMatchingStationsSpy, bot, msg, myChatId, deleteGlobalStations,
    globalStationsKeyboardAfter, sendingMessageSpy) {
    assertGetMatchingStationsCall(getMatchingStationsSpy, searchStr);
    assertHandleMatchingStationsWithFunCallWhenOnlyOneExists(handleMatchingStationsSpy, bot, msg, searchStr, myChatId,
        sendingMessageSpy, deleteGlobalStations, globalStationsKeyboardAfter);
}

function assertNoRemove(getMatchingStationsSpy, searchStr, handleMatchingStationsSpy, bot, msg,
    removeFromGlobalStationSpy) {
    assertGetMatchingStationsCall(getMatchingStationsSpy, searchStr);
    assertHandleMatchingStations(handleMatchingStationsSpy, bot, msg, searchStr)
    expect(removeFromGlobalStationSpy.called).to.be.false
}

function createStationsHelperStub(matching) {
    const stationsHelperStub = {
        getMatchingStations: () => matching.slice(0),
        handleMatchingStations: () => null
    };
    sut.__set__('stationsHelper', stationsHelperStub);
    return stationsHelperStub;
}

function assertHandleMatchingStationsWithFunCall(handleMatchingStationsSpy, bot, msg,
    searchStr, myChatId, sendingMessageSpy, removeFromGlobalStationsSpy,
    globalStationsKeyboardAfter) {

    const funToCall = assertHandleMatchingStations(handleMatchingStationsSpy, bot, msg, searchStr);

    funToCall(bot, msg, { name: 'exampleStation1' })

    assertRemoveStationWithRemaining(removeFromGlobalStationsSpy, sendingMessageSpy,
        globalStationsKeyboardAfter, myChatId);
}

function assertHandleMatchingStationsWithFunCallWhenOnlyOneExists(handleMatchingStationsSpy, bot, msg,
    searchStr, myChatId, sendingMessageSpy, deleteGlobalStations,
    globalStationsKeyboardAfter) {

    const funToCall = assertHandleMatchingStations(handleMatchingStationsSpy, bot, msg, searchStr);

    funToCall(bot, msg, { name: 'exampleStation1' })

    assertRemoveStationWithoutRemaining(deleteGlobalStations, sendingMessageSpy,
        globalStationsKeyboardAfter, myChatId);
}

function assertHandleMatchingStations(handleMatchingStationsSpy, bot, msg, searchStr) {
    const call = handleMatchingStationsSpy.getCall(0);
    expect(call.args[0]).to.equal(bot);
    expect(call.args[1]).to.equal(msg);
    assertPassedStations(call.args[2]);
    expect(call.args[3]).to.equal(searchStr);
    const funToCall = call.args[4];
    return funToCall;
}

function assertRemoveStationWithRemaining(removeFromGlobalStationsSpy, sendingMessageSpy,
    globalStationsKeyboardAfter, myChatId) {
    const removeCall = removeFromGlobalStationsSpy.getCall(0);
    expect(removeCall.args[0]).to.equal('exampleStation1');
    assertDeleteConfirmation(sendingMessageSpy, myChatId, globalStationsKeyboardAfter);
}

function assertRemoveStationWithoutRemaining(deleteGlobalStationsSpy, sendingMessageSpy,
    globalStationsKeyboardAfter, myChatId) {
    expect(deleteGlobalStationsSpy.called).to.be.true;
    assertDeleteConfirmation(sendingMessageSpy, myChatId, globalStationsKeyboardAfter);
}

function assertDeleteConfirmation(sendingMessageSpy, myChatId, globalStationsKeyboardAfter) {
    const sendingCall = sendingMessageSpy.getCall(0);
    expect(sendingCall.args[0]).to.equal(myChatId);
    expect(sendingCall.args[1]).to.equal('exampleStation1 wurde gelöscht.');
    expect(sendingCall.args[2]).to.equal(globalStationsKeyboardAfter);
}

function assertGetMatchingStationsCall(getMatchingStationsSpy, searchStr) {
    const matchingCall = getMatchingStationsSpy.getCall(0);
    const stations = matchingCall.args[0];
    assertPassedStations(stations);
    expect(matchingCall.args[1]).to.equal(searchStr);
}

function assertPassedStations(stations) {
    //expect(stations.length).to.be.equal(2);
    //expect(stations[0].name).to.be.equal('exampleStation1');
    //expect(stations[1].name).to.be.equal('exampleStation2');
}

function assertDontDeleteAllWhenRejected(queryListener, myChatId, callbackSpy,
    deleteGlobalStationsSpy, sendMessageSpy) {
    const query = {
        id: 'myQueryId',
        message: {
            chat: {
                id: myChatId
            }
        },
        data: 'noreset'
    };
    queryListener(query);

    expect(callbackSpy.getCall(0).args[0]).to.equal(query.id)

    expect(deleteGlobalStationsSpy.called).to.been.false;

    const call = sendMessageSpy.getCall(1);
    expect(call.args[0]).to.equal(myChatId)
    expect(call.args[1]).to.equal('Ok, dann nicht.')
    expect(call.args[2]).to.be.undefined
}

function assertDeleteAllGlobalStations(queryListener, myChatId, callbackSpy,
    deleteGlobalStationsSpy, sendMessageSpy) {
    const query = {
        id: 'myQueryId',
        message: {
            chat: {
                id: myChatId
            }
        },
        data: 'reset'
    };
    queryListener(query);

    expect(callbackSpy.getCall(0).args[0]).to.equal(query.id)

    expect(deleteGlobalStationsSpy.called).to.been.true;

    const call = sendMessageSpy.getCall(1);
    expect(call.args[0]).to.equal(myChatId)
    expect(call.args[1]).to.equal('Liste wurde gelöscht')
    expect(call.args[2]['reply_markup']['remove_keyboard']).to.be.true
}

function assertRegistrationOfSelectionListener(selectionSpy) {
    const call = selectionSpy.getCall(0);
    expect(call.args[0]).to.equal('callback_query');
    const queryListener = call.args[1];
    return queryListener;
}

function assertSecondDeletionQuery(sendMessageSpy, myChatId) {
    const call = sendMessageSpy.getCall(0);
    expect(call.args[0]).to.equal(myChatId);
    expect(call.args[1]).to.equal('gesamte Liste löschen?');
    const expectedSelection = call.args[2];
    expect(expectedSelection['reply_markup']['inline_keyboard'][0][0]).to.deep
        .equal({ text: 'JA  \u{1F44D}', callback_data: 'reset' });
    expect(expectedSelection['reply_markup']['inline_keyboard'][0][1]).to.deep
        .equal({ text: 'NEIN  \u{1F631}', callback_data: 'noreset' });
}

function mockGetGlobalsStationsWithTwoStations(globalStationsKeyboardAfter) {
    const exampleStation1 = 'exampleStation1';
    const exampleStation2 = 'exampleStation2';
    const global = [
        exampleStation1,
        exampleStation2
    ]
    const globalStationsHelperStub = {
        getGlobalStations: () => global.slice(0),
        removeFromGlobalStations: () => null,
        globalStationsAsKeyboard: () => globalStationsKeyboardAfter,
        deleteGlobalStations: () => null
    };
    sut.__set__('globalStationsHelper', globalStationsHelperStub);
    return globalStationsHelperStub
}

function mockGetGlobalsStationsWithOneStation(globalStationsKeyboardAfter) {
    const exampleStation1 = 'exampleStation1';
    const globalStationsHelperStub = {
        getGlobalStations: () => [
            exampleStation1
        ].slice(0),
        removeFromGlobalStations: () => null,
        globalStationsAsKeyboard: () => globalStationsKeyboardAfter,
        deleteGlobalStations: () => null
    };
    sut.__set__('globalStationsHelper', globalStationsHelperStub);
    return globalStationsHelperStub
}
