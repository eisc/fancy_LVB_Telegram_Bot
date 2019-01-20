const expect = require('chai').expect;
const {
    isEmpty,
    containedInGlobalStations,
    getMatchingGlobalStations,
    addGlobalStation,
    removeFromGlobalStations,
    deleteGlobalStations,
    globalStationsAsKeyboard
} = require('../../../app/helper/globalstations');

describe('test globalStations', () => {

    beforeEach(() => {
        deleteGlobalStations()
    })

    afterEach(() => {
        deleteGlobalStations()
    })

    describe('test isEmpty', () => {

        it('true when never added a station', () => {
            expect(isEmpty()).to.be.true
        });

        it('true, when just added station', () => {
            const myStation = {
                id: 'myStationId',
                name: 'myStationName'
            };
            addGlobalStation(myStation)

            expect(isEmpty()).to.be.false
        });

        it('false, when removed just added station', () => {
            const myStation1 = {
                id: 'myStationId1',
                name: 'myStationName1'
            };
            addGlobalStation(myStation1)
            removeFromGlobalStations(myStation1)

            expect(isEmpty()).to.be.true
        });
    });

    describe('test containedInGlobalStations', () => {

        it('false when never added a station', () => {
            const myStation = {
                id: 'myStationId',
                name: 'myStationName'
            };
            expect(containedInGlobalStations(myStation)).to.be.false
        });

        it('contains just added station', () => {
            const myStation = {
                id: 'myStationId',
                name: 'myStationName'
            };

            addGlobalStation(myStation)

            expect(containedInGlobalStations(myStation)).to.be.true
        });

        it('contains added stations', () => {
            const myStation1 = {
                id: 'myStationId1',
                name: 'myStationName1'
            };
            const myStation2 = {
                id: 'myStationId2',
                name: 'myStationName2'
            };

            addGlobalStation(myStation1)
            addGlobalStation(myStation2)

            expect(containedInGlobalStations(myStation1)).to.be.true
            expect(containedInGlobalStations(myStation2)).to.be.true
        });
    });

    describe('test getMatchingGlobalStations', () => {

        it('empty when never added a station', () => {
            const myStation = {
                id: 'myStationId',
                name: 'myStationName'
            };
            expect(getMatchingGlobalStations(myStation)).to.be.empty
        });

        it('find just added station', () => {
            const myStation = {
                id: 'myStationId',
                name: 'myStationName'
            };
            addGlobalStation(myStation)

            expect(getMatchingGlobalStations('StationName')).to.be.deep.equal([myStation])
        });

        it('return nothing for non matching', () => {
            const myStation = {
                id: 'myStationId',
                name: 'myStationName'
            };
            addGlobalStation(myStation)

            expect(getMatchingGlobalStations('StadionName')).to.be.empty
        });


        it('contains added stations', () => {
            const myStation1 = {
                id: 'myStationId1',
                name: 'myStationName1'
            };
            const myStation2 = {
                id: 'myStationId2',
                name: 'myStationName2'
            };

            addGlobalStation(myStation1)
            addGlobalStation(myStation2)

            expect(getMatchingGlobalStations('myStationName')).to.be.deep.equal([myStation1, 
                myStation2])
        });
    });    

    describe('test removeFromGlobalStation', () => {

        it('two exist, one removed, other still exists', () => {
            const myStation1 = {
                id: 'myStationId1',
                name: 'myStationName1'
            };
            const myStation2 = {
                id: 'myStationId2',
                name: 'myStationName2'
            };
            addGlobalStation(myStation1)
            addGlobalStation(myStation2)

            removeFromGlobalStations(myStation1)

            expect(containedInGlobalStations(myStation1)).to.be.false
            expect(containedInGlobalStations(myStation2)).to.be.true
        });

        it('one exists, one removed, global is empty', () => {
            const myStation1 = {
                id: 'myStationId1',
                name: 'myStationName1'
            };
            addGlobalStation(myStation1)

            removeFromGlobalStations(myStation1)

            expect(containedInGlobalStations(myStation1)).to.be.false
        });

        it('two exist, one not existing removed, both still exists', () => {
            const myStation1 = {
                id: 'myStationId1',
                name: 'myStationName1'
            };
            const myStation2 = {
                id: 'myStationId2',
                name: 'myStationName2'
            };
            const myStation3 = {
                id: 'myStationId3',
                name: 'myStationName3'
            };
            addGlobalStation(myStation1)
            addGlobalStation(myStation2)

            removeFromGlobalStations(myStation3)

            expect(containedInGlobalStations(myStation1)).to.be.true
            expect(containedInGlobalStations(myStation2)).to.be.true
            expect(containedInGlobalStations(myStation3)).to.be.false
        });
    });

    describe('test deleteGlobalStations', () => {

        it('two exist, all deleted, global is empty', () => {
            const myStation1 = {
                id: 'myStationId1',
                name: 'myStationName1'
            };
            const myStation2 = {
                id: 'myStationId2',
                name: 'myStationName2'
            };
            addGlobalStation(myStation1)
            addGlobalStation(myStation2)

            deleteGlobalStations()

            expect(containedInGlobalStations(myStation1)).to.be.false
            expect(containedInGlobalStations(myStation2)).to.be.false

        });
    });

    describe('test globalStationsAsKeyboard', () => {
        it('two exist, both returned as keyboard', () => {
            const myStation1 = {
                id: 'myStationId1',
                name: 'myStationName1'
            };
            const expectedKeyboard = {
                text: 'myStationName1',
                callback_data: 'myStationId1'
            };
            addGlobalStation(myStation1)
            const expected = {
                reply_markup: {
                    keyboard: [[expectedKeyboard]],
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