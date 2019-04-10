const gtfsHelper = require('../helper/gtfs')
const departureHelper = require('./departure')

exports.getDeparturesForStation = function (bot, msg, station) {
  try {
    gtfsHelper.fetchDeparture(bot, msg, station.id).then(
      departures => {
        departureHelper.handleDeparture(bot, msg, station, departures)
      }
    )
  } catch (error) {
    bot.sendMessage(msg.chat.id, 'Fehler ' + error.message)
  }
}
