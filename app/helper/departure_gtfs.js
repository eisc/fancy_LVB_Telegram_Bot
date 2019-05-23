const gtfsHelper = require('../helper/gtfs')
const departureHelper = require('./departure')


//ToDo: just return Message, delete bot-argument!
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

//ToDo: just return Message, delete bot-argument
function getDeparturesForStationPromise (bot, msg, station) {
  try {
    return gtfsHelper.fetchDeparture(bot, msg, station.id)
  } catch(error) {
    bot.sendMessage(msg.chat.id, 'Fehler ' + error.message)
  }
}
exports.getDeparturesForStationPromise = getDeparturesForStationPromise