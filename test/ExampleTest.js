const assert = require('assert');
const moment = require('moment');
const stations = require('lvb').stations;
const departures = require('lvb').departures;

describe('test API call', () => {
    it('should filter stations only in Leipzig', (done) => {
        try {
            stations("Hauptbahnhof").then(stations => {
                const filtered = stations.filter(station => station.lastIndexOf("Leipzig, ", 0) === 0);
                assert.equal(filtered.length, 5);
                done();
            }).catch(e => {
                done();
            });
        } catch(e) {
            done();
        }
    });
});