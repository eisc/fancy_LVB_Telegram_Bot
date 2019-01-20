const lvb = require('lvb')
const commonStationHelper = require('./commonstations')
const departureHelper = require('./departure')

exports.getDeparturesForStation = function (bot, msg, station) {
    try {
        lvb.departures(commonStationHelper.normalizeStationId(station.id), new Date()).then(
            departures => departureHelper.handleDeparture(bot, msg, station, departures)
        )
    } catch(error) {
        bot.sendMessage(msg.chat.id, 'Fehler ' + error.message)
    }
}