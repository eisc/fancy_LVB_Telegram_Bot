const lvb = require('lvb')
const normalizer = require('../../stations/normalizer')
const query = require('../query')

exports.getDeparturesForStation = function (bot, msg, station) {
  const departures = getLvbDeparturesForStation (station)
  query.handleDeparture(bot, msg, station, departures)
}

async function getLvbDeparturesForStation (station) {
    return await lvb.departures(normalizer.normalizeStationId(station.id), new Date())
}
exports.getLvbDeparturesForStation = getLvbDeparturesForStation