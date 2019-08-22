
//import names should be the module-names, now it is very difficult to follow
const gtfsStations = require('../helper/stations/gtfs')
const stationsMatcher = require('../helper/stations/matcher')
const stationsNormalizer = require('../helper/stations/normalizer')
const departureCollector = require('../helper/departures/collector')
const departureQuery = require('../helper/departures/query')
const selection = require('../helper/stations/selection/selection')
const selectable = require('../helper/stations/selection/selectable')

const commandRegex = /^((?!(\/start|\/help|\/plan|\/add|\/context|\/reset)).)*$/

function registerListener (bot, contextResolver) {
  bot.onText(commandRegex, (msg, match) => handlePotentialStation(bot, msg.chat.id, match[0], contextResolver))
}

async function handlePotentialStation (bot, chatId, station, contextResolver) {
  const allStops = await gtfsStations.fetchAllStops()
  const matchingStations = stationsMatcher.getMatchingStations(allStops, station, contextResolver)
  const formattedStations = matchingStations.map(station => {
    station.name = stationsNormalizer.normalizeStationName(station)
    return station
  })
  handleMatchingStations(bot, chatId, formattedStations, station)
}

async function handleMatchingStations (bot, chatId, stations, station) {
  const message = selection.getMessageForMatchingStations(stations, station)
  if (message) {
    bot.sendMessage(chatId, message)
  } else if (stations.length === 1) {
    const foundStation = stations[0]
    const departures = await departureCollector.collectDepartures(foundStation)
    departureQuery.handleDeparture(bot, chatId, foundStation, departures)
  } else {
    handleMultipleMatchingStations(bot, chatId, stations);
  }
}

function handleMultipleMatchingStations(bot, chatId, stations) {
  const offer = selectable.offerMatchingStationsForSelection(stations);
  bot.sendMessage(chatId, `Meintest du eine dieser ${stations.length} Haltestellen?`, offer);
  bot.once('callback_query', query => {
    const station = stations.find(station => station.id === query.data);
    bot.answerCallbackQuery(query.id);
    if (station) {
      departureCollector.collectDepartures(station).then(
        departures => departureQuery.handleDeparture(bot, chatId, station, departures)
      );
    }
  });
}

async function handleInline (bot, data, contextResolver) {
  var content = data.query;
  if (!content || content.length == 0 || content.startsWith("/")) {
      return;
  }
  const allStops = await gtfsStations.fetchAllStops()
  const matchingStations = stationsMatcher.getMatchingStations(allStops, content, contextResolver)
  const formattedStations = matchingStations.map(station => {
    station.name = stationsNormalizer.normalizeStationName(station)
    return station
  })
  const message = selection.getMessageForMatchingStations(formattedStations, content)
  const list = []
  if (message) {
    list.push({
      id: '0',
      type: 'article',
      title: message,
      message_text: message
    })
  } else if (formattedStations.length > 0) {
    const maxStations = formattedStations.length > 10 ? 10 : formattedStations.length
    for (index = 0; index < maxStations; index++) {
      const foundStation = formattedStations[index]
      const departures = await departureCollector.collectDepartures(foundStation)
      const result = await departureQuery.handleDepartureInline(foundStation, departures)
      if (result) {
        list.push({
          id: '' + index,
          type: 'article',
          title: 'Abfahrten ' + foundStation.name,
          message_text: result
        })  
      }
    }
  }
  bot.answerInlineQuery(data.id, list);
}

module.exports = Object.freeze({
  commandRegex,
  registerListener,
  handleInline
});