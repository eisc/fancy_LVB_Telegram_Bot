const lvb = require('lvb')
const commonStationHelper = require('./commonstations')
const departureHelper = require('./departure')

exports.getDeparturesForStation = function (bot, msg, station) {
  try {
    const departures = getLvbDeparturesForStation (station)
    departureHelper.handleDeparture(bot, msg, station, departures)
  } catch(error) {
    bot.sendMessage(msg.chat.id, 'Fehler ' + error.message)
  }
}

async function getLvbDeparturesForStation (station) {
    return await lvb.departures(commonStationHelper.normalizeStationId(station.id), new Date())
}
exports.getLvbDeparturesForStation = getLvbDeparturesForStation