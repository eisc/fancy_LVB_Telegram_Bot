const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const moment = require('moment')
const sut = rewire('../../../app/helper/departure.js');
/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */
const handleDeparture = sut.handleDeparture
const handleDepartureTime = sut.__get__('handleDepartureTime')
const handleDelay = sut.__get__('handleDelay')
const compareDepartures = sut.__get__('compareDepartures')
const createAnswerForDepartureResult = sut.__get__('createAnswerForDepartureResult')

describe('test departure calculation', () => {

    beforeEach(() => {
        sut.__set__('fixedDate', moment('2018-12-25T21:31:43.000+0100'))
    })

    afterEach(() => {
        sut.__set__('fixedDate', null)
    })

    describe('test handleDepartureTime', () => {
        it('should send diff in minutes to reference date', () => {
            const time = {
                departure: '2018-12-25T21:33:15.050+0100',
                departureDelay: 0
            };
            const answer = handleDepartureTime(time)
            const expectedAnswer = 1
            expect(answer).to.equal(expectedAnswer)
        });

        it('should send empty string, when diff to reference date is lower 1', () => {
            const time = {
                departure: '2018-12-25T21:32:00.000+0100',
                departureDelay: 0
            };
            const answer = handleDepartureTime(time)
            const expectedAnswer = ''
            expect(answer).to.equal(expectedAnswer)
        });

        it('should send negative number, when departure is in past', () => {
            const time = {
                departure: '2018-12-25T21:30:00.000+0100',
                departureDelay: 0
            };
            const answer = handleDepartureTime(time)
            const expectedAnswer = -2
            expect(answer).to.equal(expectedAnswer)
        });
    });

    describe('test handleDelay', () => {

        it('should send answer with delay included, when delay is greater 0', () => {
            const time = {
                departure: '2018-12-25T21:33:15.050+0100',
                departureDelay: 180000
            };
            const answer = handleDelay(time)
            const expectedAnswer = ' +3'
            expect(answer).to.equal(expectedAnswer)
        });

        it('should suppress delay when lower than one minute delay', () => {
            const time = {
                departure: '2018-12-25T21:33:15.050+0100',
                departureDelay: 50000
            };
            const answer = handleDelay(time)
            const expectedAnswer = ''
            expect(answer).to.equal(expectedAnswer)
        });

        it('should send answer with delay included, when delay is lower 0', () => {
            const time = {
                departure: '2018-12-25T21:33:15.050+0100',
                departureDelay: -180000
            };
            const answer = handleDelay(time)
            const expectedAnswer = ' -3'
            expect(answer).to.equal(expectedAnswer)
        });
    });
        
    describe('test createAnswerForDepartureResult', () => {
        it('should send no line info available message, when line not defined', () => {
            const station = {};
            const result = [];
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
            const result = [{
                line: {
                    name: lineName,
                    direction: lineDirection
                },
                timetable: []
            }];
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
            const result = [getResult1(lineName, lineDirection)];
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
            const result2 = getResult2('MyLine2', '>MyLineDirection2');
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