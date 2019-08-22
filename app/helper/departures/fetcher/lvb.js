const lvb = require('lvb')
const normalizer = require('../../stations/normalizer')

async function getLvbDeparturesForStation (station) {
    try {
        return await internalGetLvbDeparturesForStation(station)
    } catch(e) {        
        return await Promise.resolve([]);
    }
}

async function internalGetLvbDeparturesForStation (station) {
    return await lvb.departures(normalizer.normalizeStationId(station.id), new Date())
}
exports.getLvbDeparturesForStation = getLvbDeparturesForStation