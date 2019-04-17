const commonStationsHelper = require('./commonstations')
const gtfsHelper = require('../helper/gtfs')

exports.getAllStations = function (bot, msg, match, contextResolver) {
  return gtfsHelper.fetchAllStops().then(data => {
    const matchingStations = commonStationsHelper.getMatchingStations(data, match[0], contextResolver)
    const formattedStations = matchingStations.map(station => {
      station.name = commonStationsHelper.normalizeStationName(station)
      return station
    })
    return Promise.resolve(formattedStations)
  })
}

exports.handleMatchingStations = function (bot, msg, stations, requestString,
  handleMatchingStationFun) {
  if (tooManyStationsFound(stations)) {
    bot.sendMessage(msg.from.id, 'Es gibt zu viele Treffer, bitte gib was genaueres ein.')
  } else if (noStationsFound(stations)) {
    bot.sendMessage(msg.from.id, `${requestString} ist keine Haltestelle, versuch es nochmal. \u{1F643}`)
  } else if (stations.length === 1) {
    handleMatchingStationFun(bot, msg, stations[0])
  } else {
    handleMultipleMatchingStations(bot, msg, stations, handleMatchingStationFun)
  }
}

function handleMultipleMatchingStations (bot, msg, stations, handleMatchingStationFun) {
  const selectableStationNames = commonStationsHelper.transformToSelectableStationNames(stations)
  bot.sendMessage(msg.from.id,
    `Meintest du eine dieser ${selectableStationNames.length} Haltestellen?`,
    offerMatchingStationsForSelection(selectableStationNames))
  bot.on('callback_query', query => {
    const station = stations.find(station => station.id === query.data)
    bot.answerCallbackQuery(query.id)
    if (station) {
      handleMatchingStationFun(bot, msg, station)
    }
  })
}

function offerMatchingStationsForSelection (stationNames) {
  return {
    reply_markup: {
      inline_keyboard: stationNames
    }
  }
}

function noStationsFound (stations) {
  return stations.length === 0
}

function tooManyStationsFound (stations) {
  return stations.length >= 11
}
