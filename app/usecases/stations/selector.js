const commonStationHelper = require('./commonstations')
const selectionHelper = require('../../helper/stations/selection')

exports.handleMatchingStations = function (bot, msg, stations, requestString,
  handleMatchingStationFun) {
  const message = selectionHelper.getMessageForMatchingStations(station, requestString)
  if (message) {
    bot.sendMessage(msg.chat.id, message)
  } else if (stations.length === 1) {
    handleMatchingStationFun(bot, msg, stations[0])
  } else {
    handleMultipleMatchingStations(bot, msg, stations, handleMatchingStationFun);
  }
}

//why is handler-function in helper-module?
function handleMultipleMatchingStations(bot, msg, stations, handleMatchingStationFun) {
  const selectableStationNames = commonStationHelper.transformToSelectableStationNames(stations);
  bot.sendMessage(msg.chat.id,
    `Meintest du eine dieser ${selectableStationNames.length} Haltestellen?`,
    offerMatchingStationsForSelection(selectableStationNames));
  bot.on('callback_query', query => {
    const station = stations.find(station => station.id === query.data);
    bot.answerCallbackQuery(query.id);
    if (station) {
      handleMatchingStationFun(bot, msg, station)
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


