const expect = require('chai').expect;
const { 
    getGlobalStations, 
    addGlobalStation,
    removeFromGlobalStation, 
    deleteGlobalStations,
    globalStationsAsKeyboard 
} = require('../../../app/helper/globalStations');

describe('test globalStations', () => {

    beforeEach(() => {
        deleteGlobalStations()
    })

    afterEach(() => {
        deleteGlobalStations()
    })

    describe('test addGlobalStation', () => {

        it('empty when never added a station', () => {
            expect(getGlobalStations()).to.have.length(0)
        });

        it('contains just added station', () => {
            const stationName = 'myStationName';
            addGlobalStation(stationName)
            expect(getGlobalStations()).to.have.all.members([stationName])
        });        

        it('contains added stations', () => {
            const stationName1 = 'myStationName1';
            const stationName2 = 'myStationName2';
            const expectedStations = [
                stationName1,
                stationName2
            ];
            addGlobalStation(stationName1)
            addGlobalStation(stationName2)
            expect(getGlobalStations()).to.have.all.members(expectedStations)
        });        
    });

    describe('test removeFromGlobalStation', () => {

        it('two exist, one removed, other still exists', () => {
            const stationName1 = 'myStationName1';
            const stationName2 = 'myStationName2';
            addGlobalStation(stationName1)
            addGlobalStation(stationName2)
            removeFromGlobalStation(stationName1)
            expect(getGlobalStations()).to.have.all.members([stationName2])
        });

        it('one exists, one removed, global is empty', () => {
            const stationName1 = 'myStationName1';
            addGlobalStation(stationName1)
            removeFromGlobalStation(stationName1)
            expect(getGlobalStations()).to.have.length(0)
        });

        it('two exist, one not existing removed, both still exists', () => {
            const stationName1 = 'myStationName1';
            const stationName2 = 'myStationName2';
            addGlobalStation(stationName1)
            addGlobalStation(stationName2)
            removeFromGlobalStation('stationName3')
            const expectedStations = [
                stationName1,
                stationName2
            ];
            expect(getGlobalStations()).to.have.all.members(expectedStations)
        });
    });    

    describe('test deleteGlobalStations', () => {

        it('two exist, all deleted, global is empty', () => {
            const stationName1 = 'myStationName1';
            const stationName2 = 'myStationName2';
            addGlobalStation(stationName1)
            addGlobalStation(stationName2)
            deleteGlobalStations()
            expect(getGlobalStations()).to.have.length(0)
        });
    });    

    describe('test globalStationsAsKeyboard', () => {
        it('two exist, both returned as keyboard', () => {
            const stationName = 'myStationName';
            addGlobalStation(stationName)
            const expected = {
                reply_markup: {
                    keyboard: [[stationName]],
                    resize_keyboard: true
                }
            }
            expect(globalStationsAsKeyboard()).to.deep.equal(expected)
        });

        it('nothing exists, empty keyboard returned', () => {
            const expected = {
                reply_markup: {
                    keyboard: [[]],
                    resize_keyboard: true
                }
            }
            expect(globalStationsAsKeyboard()).to.deep.equal(expected)
        });
    });    
});