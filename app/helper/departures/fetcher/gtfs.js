const moment = require('moment')
const query = require('../query')
const gtfs2lvb = require('../format/gtfs2lvb')

exports.getDeparturesForStation = function (station) {
  const departures = getGtfsDeparturesForStation(station.id)
  query.handleDeparture(bot, msg, station, departures)
}

async function getGtfsDeparturesForStation (stopId) {
  const now = moment().format('YYYYMMDD')
  const response = await fetch(`https://gtfs.leipzig.codefor.de/otp/routers/default/index/stops/${stopId}/stoptimes/${now}`)
  const retrievedDepartures = JSON.parse(response.text())
  return gtfs2lvb.transformToLvbLayout(retrievedDepartures)
}
exports.getGtfsDeparturesForStation = getGtfsDeparturesForStation