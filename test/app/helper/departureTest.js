const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const sut = rewire('../../../app/helper/departure.js');
/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */
const handleDeparture = sut.handleDeparture
const handleDepartureTime = sut.__get__('handleDepartureTime')
const createAnswerForDepartureResult = sut.__get__('createAnswerForDepartureResult')

describe('test departure calculation', () => {

    describe('test handleDepartureTime', () => {
        it('should send answer without delay included, when delay is 0', () => {
            const time = {
                departure: '2018-12-25T21:33:15.050+0100',
                departureDelay: 0
            };
            const answer = handleDepartureTime(time)
            const expectedAnswer = '- um 21:33\n'
            expect(answer).to.equal(expectedAnswer)
        });

        it('should send answer with delay included, when delay is greater 0', () => {
            const time = {
                departure: '2018-12-25T21:33:15.050+0100',
                departureDelay: 180000
            };
            const answer = handleDepartureTime(time)
            const expectedAnswer = '- um 21:33 mit einer Verspätung von 3 Minuten\n'
            expect(answer).to.equal(expectedAnswer)
        });

        it('should send "Minute" instead of "Minutes" when only one minute delay', () => {
            const time = {
                departure: '2018-12-25T21:33:15.050+0100',
                departureDelay: 60000
            };
            const answer = handleDepartureTime(time)
            const expectedAnswer = '- um 21:33 mit einer Verspätung von 1 Minute\n'
            expect(answer).to.equal(expectedAnswer)
        });

        it('should suppress delay when lower than one minute delay', () => {
            const time = {
                departure: '2018-12-25T21:33:15.050+0100',
                departureDelay: 50000
            };
            const answer = handleDepartureTime(time)
            const expectedAnswer = '- um 21:33\n'
            expect(answer).to.equal(expectedAnswer)
        });
    });

    describe('test createAnswerForDepartureResult', () => {
        it('should send no line info available message, when line not defined', () => {
            const station = {};
            const result = {};
            const answer = createAnswerForDepartureResult(station, result)
            const expectedAnswer = 'Keine Linieninformationen verfügbar'
            expect(answer).to.equal(expectedAnswer)
        });

        it('should send no departure info available message, when timetable not defined', () => {
            const stationName = 'MyStation'
            const station = {
                name: stationName
            };
            const lineName = 'MyLine'
            const lineDirection = 'MyLineDirection'
            const result = {
                line: {
                    name: lineName,
                    direction: lineDirection
                }
            };
            const answer = createAnswerForDepartureResult(station, result)
            const expectedAnswer = 'Abfahrt ab ' + stationName + ' von ' + lineName
                + ' in Richtung ' + lineDirection + '\n'
                + '- Keine Abfahrtszeiten verfügbar'
            expect(answer).to.equal(expectedAnswer)
        });

        it('should send departure infos according to time table', () => {
            const stationName = 'MyStation'
            const station = {
                name: stationName
            };
            const lineName = 'MyLine'
            const lineDirection = 'MyLineDirection'
            const result = getResult1(lineName, lineDirection);
            const answer = createAnswerForDepartureResult(station, result)
            const expectedAnswer = 'Abfahrt ab ' + stationName + ' von ' + lineName
                + ' in Richtung ' + lineDirection + '\n'
                + '- um 21:33 mit einer Verspätung von 3 Minuten\n'
                + '- um 21:50\n'
            expect(answer).to.equal(expectedAnswer)
        });
    });

    describe('test handleDeparture', () => {
        var bot = null;
        var sendMessageSpy = null;
        var msg = null;
        const myChatId = 'myChatId'

        beforeEach(() => {
          bot = {
            sendMessage: () => null
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

        it('should handle missing departures', () => {
            const stationName = 'MyStation'
            const station = {
                name: stationName
            };
            const departureResults = []
            handleDeparture(bot, msg, station, departureResults)

            const call = sendMessageSpy.getCall(0);
            expect(call.args[0]).to.equal(myChatId);
            expect(call.args[1]).eq('Keine aktuellen Abfahrten gefunden für ' + stationName);
        });

        it('should display existing departures', () => {
            const station = {
                name: 'MyStation'
            };
            const result1 = getResult1('MyLine1', 'MyLineDirection1');
            const result2 = getResult2('MyLine2', 'MyLineDirection2');
            const departureResults = [
                result1,
                result2
            ];
            handleDeparture(bot, msg, station, departureResults)

            assertAnswer1(sendMessageSpy, myChatId);
            assertAnswer2(sendMessageSpy, myChatId);
        });
    });

    function getResult1(lineName, lineDirection) {
        return {
            line: {
                name: lineName,
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

    function getResult2(lineName, lineDirection) {
        return {
            line: {
                name: lineName,
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

    function assertAnswer2(sendMessageSpy, myChatId) {
        const call2 = sendMessageSpy.getCall(1);
        expect(call2.args[0]).to.equal(myChatId);
        const expectedAnswer2 = 'Abfahrt ab MyStation von MyLine2'
            + ' in Richtung MyLineDirection2\n'
            + '- um 21:55\n';
        expect(call2.args[1]).eq(expectedAnswer2);
    }

    function assertAnswer1(sendMessageSpy, myChatId) {
        const call1 = sendMessageSpy.getCall(0);
        expect(call1.args[0]).to.equal(myChatId);
        const expectedAnswer1 = 'Abfahrt ab MyStation von MyLine1'
            + ' in Richtung MyLineDirection1\n'
            + '- um 21:33 mit einer Verspätung von 3 Minuten\n'
            + '- um 21:50\n';
        expect(call1.args[1]).eq(expectedAnswer1);
        return { call1, expectedAnswer1 };
    }
});