const lvb = require('lvb')
const commonStationHelper = require('./commonstations')
const departureHelper = require('./departure')

exports.getDeparturesForStation = function (bot, msg, station) {
  try {
    getDeparturesForStationPromise (station).then(
      departures => departureHelper.handleDeparture(bot, msg, station, departures)
    ).catch(function(error) { 
      bot.sendMessage(msg.chat.id, 'Fehler ' + error.message)
    })
  } catch(error) {
    bot.sendMessage(msg.chat.id, 'Fehler ' + error.message)
  }
}


function getDeparturesForStationPromise (station) {
  try {
    return lvb.departures(commonStationHelper.normalizeStationId(station.id), new Date())
  } catch(error) {
    bot.sendMessage(msg.chat.id, 'Fehler ' + error.message)
  }
}
exports.getDeparturesForStationPromise = getDeparturesForStationPromise