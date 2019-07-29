const gtfsStations = require('../../helper/stations/gtfs')
const stationsMatcher = require('../../helper/stations/matcher')
const globalStations = require('../../helper/stations/global')
const stationsNormalizer = require('../../helper/stations/normalizer')
const selection = require('../../helper/stations/selection/selection')
const selectable = require('../../helper/stations/selection/selectable')

const commandRegex = /\/add(\s*)(.*)/

function registerListener (bot, isInCurrentContextFun) {
    bot.onText(commandRegex, (msg, match) => handleCommandAdd (bot, msg.chat.id, match[2], isInCurrentContextFun))
}

function handleCommandAdd (bot, chatId, station, isInCurrentContext) {
  if (station === '') {
    bot.sendMessage(chatId, 'Bitte gib eine Haltestelle ein.')
    return
  }
  const allStops = gtfsStations.fetchAllStops()
  const matchingStations = stationsMatcher.getMatchingStations(allStops, station, isInCurrentContext)
  const formattedStations = matchingStations.map(station => {
    station.name = stationsNormalizer.normalizeStationName(station)
    return station
  })
  handleMatchingStations(bot, chatId, formattedStations, station)
}

function handleMatchingStations (bot, chatId, stations, station) {
  const message = selection.getMessageForMatchingStations(stations, station)
  if (message) {
    bot.sendMessage(chatId, message)
  } else if (stations.length === 1) {
    handleMatchingStation(bot, chatId, stations[0])
  } else {
    handleMultipleMatchingStations(bot, chatId, stations);
  }
}

function handleMultipleMatchingStations(bot, chatId, stations) {
  const selectableStationNames = selectable.transformToSelectableStationNames(stations);
  bot.sendMessage(chatId,
    `Meintest du eine dieser ${selectableStationNames.length} Haltestellen?`,
    offerMatchingStationsForSelection(selectableStationNames));
  bot.on('callback_query', query => {
    const station = stations.find(station => station.id === query.data);
    bot.answerCallbackQuery(query.id);
    if (station) {
      handleMatchingStation(bot, chatId, station)
    }
  });
}

function offerMatchingStationsForSelection(stationNames) {
  return {
    reply_markup: {
      inline_keyboard: stationNames
    }
  }
}

function handleMatchingStation(bot, chatId, station) {
  if (globalStations.containedInGlobalStations(station)) {
    bot.sendMessage(chatId, `${station.name} steht bereits auf der Liste.`);
  } else if (currentContextFun(station)) {
    globalStations.addGlobalStation(station);
    bot.sendMessage(chatId, `${station.name} wurde hinzugefügt.`,
    globalStations.globalStationsAsKeyboard())
  } else {
    bot.sendMessage(chatId, `${station.name} passt nicht zum aktuell gesetzten Context.`);
  }
}

module.exports = Object.freeze({
  commandRegex,
  registerListener
});