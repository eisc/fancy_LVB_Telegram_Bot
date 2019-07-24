const lvb = require('lvb')
const commonStationHelper = require('./commonstations')
const departureHelper = require('./departure')

exports.getDeparturesForStation_old = function (bot, msg, station) {
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

exports.getDeparturesForStation = function (bot, msg, station) {
  try {
    const departures = getDeparturesForStationPromise (station)
    departureHelper.handleDeparture(bot, msg, station, departures)
  } catch(error) {
    bot.sendMessage(msg.chat.id, 'Fehler ' + error.message)
  }
}

async function getDeparturesForStationPromise (station) {
  try {
    return await lvb.departures(commonStationHelper.normalizeStationId(station.id), new Date())
  } catch(error) {
    bot.sendMessage(msg.chat.id, 'Fehler ' + error.message)
  }
}
exports.getDeparturesForStationPromise = getDeparturesForStationPromise