const lvb = require('lvb')
const normalizer = require('../../stations/normalizer')

async function getLvbDeparturesForStation (station) {
    return await lvb.departures(normalizer.normalizeStationId(station.id), new Date())
}
exports.getLvbDeparturesForStation = getLvbDeparturesForStation