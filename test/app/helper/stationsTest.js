const expect = require('chai').expect;
const sinon = require('sinon');
const { 
    getMatchingStations, 
    handleMatchingStations
} = require('../../../app/helper/stations');

describe('test helper module stations', () => {
    const myStationName = 'myStationName'
    const myChatId = 'myChatId'
    const requestString = 'myRequestString'

    describe('test getMatchingStations', () => {

        it('should return empty list when stations list empty', () => {
            expect(getMatchingStations([], myStationName)).to.be.empty
        });

        it('should return empty list when no matching station', () => {
            expect(getMatchingStations([
                {
                    name: 'myOtherStationName'
                }
            ], myStationName)).to.be.empty
        });

        it('should return one element list when exactly one matching station', () => {
            expect(getMatchingStations([{
                name: 'myOtherStationName'
            }, 
            {
                name: myStationName
            }], myStationName)).to.eql([{
                name: myStationName
            }])
        });

        it('should return list with only matched stations when multiple matching stations', () => {
            const withPrefix = 'prefix' + myStationName
            const withPostfix = myStationName + 'postfix'
            const inCenter = 'before' + myStationName + 'after'
            expect(getMatchingStations([
                {
                    name: inCenter
                },
                {
                    name: withPostfix
                }, 
                {
                    name: withPrefix
                }], myStationName)).to.eql([
                    {
                        name: inCenter
                    }, 
                    {
                        name: withPostfix
                    }, 
                    {
                        name: withPrefix
                    }])
        });
    });

    describe('test handleMatchingStations', () => {
        var bot = null;
        var sendMessageSpy = null;
        var handleMatchingStationFunFake = null;
        var msg = null;

        beforeEach(() => {
            bot = {
                sendMessage: () => null,
                on: () => null,
                answerCallbackQuery: () => null
            };
            sendMessageSpy = sinon.spy(bot, 'sendMessage');
            handleMatchingStationFunFake = sinon.fake()
            msg = {
                chat: {
                    id: myChatId
                }
            };
        })

        afterEach(() => {
            sinon.restore()
        })

        it('should answer with warn message when stations list empty', () => {
            handleMatchingStations(bot, msg, [], requestString,
                handleMatchingStationFunFake)
            assertAnswerForNoStations(sendMessageSpy, myChatId, requestString)
        });

        it('should call passed in function with station when exactly one station', () => {
            handleMatchingStations(bot, msg, [{ 
                id: myStationName + 'Id',
                name: myStationName 
            }], requestString,
                handleMatchingStationFunFake)
            const call = sendMessageSpy.getCall(0);
            expect(call).to.be.null;       
            assertAnswerForStation(bot, msg, handleMatchingStationFunFake, 0, 
                myStationName + 'Id', myStationName)
        });

        it('should call passed in function with all stations when multiple stations, but less than 11', () => {
            const onSpy = sinon.spy(bot, 'on'); 
            const answerCallbackQuerySpy = sinon.spy(bot, 'answerCallbackQuery'); 
            const stations = []
            for (var listIndex = 0; listIndex < 10; listIndex += 1) {
                stations.push({
                    id: myStationName + 'Id' + listIndex,
                    name: myStationName + listIndex
                })
            }
            const keyboardEntries = []
            for(var keyIndex = 0; keyIndex < 10; keyIndex += 1) {
                keyboardEntries.push([{
                    text: myStationName + keyIndex,
                    callback_data: 'myStationNameId' + keyIndex
                }])
            }
            handleMatchingStations(bot, msg, stations, requestString,
                handleMatchingStationFunFake)
            assertAnswerForMultipleStation(sendMessageSpy, onSpy, bot, msg, 
                handleMatchingStationFunFake, answerCallbackQuerySpy, keyboardEntries)
        });

        it('should send warn message when more than 11 stations', () => {
            const stations = []
            for (var listIndex = 0; listIndex < 11; listIndex += 1) {
                stations.push({
                    id: myStationName + 'Id' + listIndex,
                    name: myStationName + listIndex
                })
            }
            handleMatchingStations(bot, msg, stations, requestString,
                handleMatchingStationFunFake)
            assertAnswerForTooManyStations(sendMessageSpy, myChatId, requestString)
        });
    });    

    function assertAnswerForNoStations(sendMessageSpy, myChatId, requestString) {
        const call = sendMessageSpy.getCall(0);
        expect(call.args[0]).to.equal(myChatId);
        const expectedAnswer = requestString + ' nicht gefunden.'
        expect(call.args[1]).eq(expectedAnswer);
    }

    function assertAnswerForStation(bot, msg, handleMatchingStationFunStub, 
            index, stationId, stationName) {
        const funCall = handleMatchingStationFunStub.getCall(index);
        expect(funCall.args[0]).to.eql(bot);
        expect(funCall.args[1]).to.eql(msg);
        expect(funCall.args[2]).to.eql({
            id: stationId,
            name: stationName
        });
    }    

    function assertAnswerForMultipleStation(sendMessageSpy, onSpy, bot, msg, 
            handleMatchingStationFunFake, answerCallbackQuerySpy, keyboardEntries) {
        const call = sendMessageSpy.getCall(0);
        expect(call.args[0]).to.equal(myChatId);
        const expectedAnswer = 'Meintest du eine dieser 10 Haltestellen?'
        expect(call.args[1]).eq(expectedAnswer);
        const expectedKeyboard = {
            reply_markup: {
                inline_keyboard: keyboardEntries
            }
        }
        expect(call.args[2]).to.deep.eql(expectedKeyboard);
        const onCall = onSpy.getCall(0);
        expect(onCall.args[0]).to.equal('callback_query');
        const queryFun = onCall.args[1];
        assertQueryAfterMultipleSelection(sendMessageSpy, bot, msg, 
            handleMatchingStationFunFake, queryFun, answerCallbackQuerySpy)
    }    

    function assertQueryAfterMultipleSelection(sendMessageSpy, bot, msg, 
            handleMatchingStationFunFake, queryFun, answerCallbackQuerySpy) {
        queryFun({
            id: 'myQueryId',
            data: myStationName + 'Id0'
        })
        const callbackCall = answerCallbackQuerySpy.getCall(0);
        expect(callbackCall.args[0]).to.equal('myQueryId');
        assertAnswerForStation(bot, msg, handleMatchingStationFunFake, 
            0, myStationName + 'Id0', myStationName + '0')
    }

    function assertAnswerForTooManyStations(sendMessageSpy, myChatId) {
        const call = sendMessageSpy.getCall(0);
        expect(call.args[0]).to.equal(myChatId);
        const expectedAnswer = 'Es gibt zu viele Treffer, bitte gib was genaueres ein.'
        expect(call.args[1]).eq(expectedAnswer);
    }
});