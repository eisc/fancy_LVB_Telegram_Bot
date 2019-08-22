const gtfsStations = require('../helper/stations/gtfs')
const nearest = require('../helper/stations/nearest')
const departureCollector = require('../helper/departures/collector')
const departureQuery = require('../helper/departures/query')

const MAX_NEAREST_STATIONS = 5;

exports.registerListener = function (bot) {
  bot.on('location', msg => handleCommandLocation(bot, msg))
}

function handleCommandLocation(bot, msg) {
  const allStops = gtfsStations.fetchAllStops();
  const stationNames = nearest.getNearestStationsForSelection(allStops, msg.location, MAX_NEAREST_STATIONS)
  bot.sendMessage(msg.chat.id, `Danke. Das sind die nächsten ${MAX_NEAREST_STATIONS} Haltestellen:`, {
    reply_markup: {
      inline_keyboard: stationNames
    }
  })
  bot.once('callback_query', query => {
    const station = allStops.find(station => station.id === query.data)
    bot.answerCallbackQuery(query.id)
    departureCollector.collectDepartures(station).then(
      departures => departureQuery.handleDeparture(bot, msg.chat.id, station, departures) 
    );
  })
}