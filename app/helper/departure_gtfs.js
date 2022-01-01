const gtfsHelper = require('../helper/gtfs')
const departureHelper = require('./departure')

exports.getDeparturesForStation = function (bot, msg, station) {
  try {
    getDeparturesForStationPromise(bot, msg, station.id).then(
      departures => {
        departureHelper.handleDeparture(bot, msg, station, departures)
      }
    ).catch(function(error) {
      bot.sendMessage(msg.chat.id, 'Fehler ' + error.message)
    })
  } catch(error) {
    bot.sendMessage(msg.chat.id, 'Fehler ' + error.message)
  }
}

function getDeparturesForStationPromise (bot, msg, station) {
  try {
    return gtfsHelper.fetchDeparture(bot, msg, station)
  } catch(error) {
    bot.sendMessage(msg.chat.id, 'Fehler ' + error.message)
  }
}
exports.getDeparturesForStationPromise = getDeparturesForStationPromise