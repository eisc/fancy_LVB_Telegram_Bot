const expect = require('chai').expect;
const { normalizeStationId } = require('../../../app/helper/commonstations');

describe('test common helper module stations', () => {

    describe('test normalizeStationId', () => {
        it('should trim prefix', () => {
            const normalized = normalizeStationId('1:006789')
            expect(normalized).to.be.not.undefined
            expect(normalized).to.be.equal('6789')
        });

        it('should leave id unchanged, when not having prefix', () => {
            const normalized = normalizeStationId('6789')
            expect(normalized).to.be.not.undefined
            expect(normalized).to.be.equal('6789')
        });        
    });
});