const gtfsStations = require('../../helper/stations/gtfs')
const stationsMatcher = require('../../helper/stations/matcher')
const globalStations = require('../../helper/stations/global')
const stationsNormalizer = require('../../helper/stations/normalizer')
const selectionHelper = require('../../helper/stations/selection')

exports.commandRegex = /\/add(\s*)(.*)/

exports.registerListener = function (bot, isInCurrentContextFun) {
    bot.onText(commandRegex, (msg, match) => handleCommandAdd (bot, msg, match[2], isInCurrentContextFun))
}

exports.handleCommandAdd = function (bot, msg, station, isInCurrentContext) {
  if (station === '') {
    bot.sendMessage(msg.chat.id, 'Bitte gib eine Haltestelle ein.')
    return
  }
  const allStops = gtfsStations.fetchAllStops()
  const matchingStations = stationsMatcher.getMatchingStations(allStops, station, isInCurrentContext)
  const formattedStations = matchingStations.map(station => {
    station.name = stationsNormalizer.normalizeStationName(station)
    return station
  })
  handleMatchingStations(bot, msg, formattedStations, station, isInCurrentContext)
}

function handleMatchingStations (bot, msg, stations, requestString) {
  const message = selectionHelper.getMessageForMatchingStations(station, requestString)
  if (message) {
    bot.sendMessage(msg.chat.id, message)
  } else if (stations.length === 1) {
    handleMatchingStation(bot, msg, stations[0])
  } else {
    handleMultipleMatchingStations(bot, msg, stations);
  }
}

function handleMultipleMatchingStations(bot, msg, stations) {
  const selectableStationNames = commonStationHelper.transformToSelectableStationNames(stations);
  bot.sendMessage(msg.chat.id,
    `Meintest du eine dieser ${selectableStationNames.length} Haltestellen?`,
    offerMatchingStationsForSelection(selectableStationNames));
  bot.on('callback_query', query => {
    const station = stations.find(station => station.id === query.data);
    bot.answerCallbackQuery(query.id);
    if (station) {
      handleMatchingStation(bot, msg, station)
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

function handleMatchingStation(bot, msg, station) {
  if (globalStations.containedInGlobalStations(station)) {
    bot.sendMessage(msg.chat.id, `${station.name} steht bereits auf der Liste.`);
  } else if (currentContextFun(station)) {
    globalStations.addGlobalStation(station);
    bot.sendMessage(msg.chat.id, `${station.name} wurde hinzugefügt.`,
    globalStations.globalStationsAsKeyboard())
  } else {
    bot.sendMessage(msg.chat.id, `${station.name} passt nicht zum aktuell gesetzten Context.`);
  }
}
