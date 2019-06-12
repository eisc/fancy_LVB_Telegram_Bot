const globalStationsHelper = require('../helper/globalstations')
const stationsHelper = require('../helper/stations')

//Controller-Function
exports.handleCommandReset = function (bot, msg, match) {
  if (globalStationsHelper.globalStationsLength() === 0) {
    bot.sendMessage(msg.chat.id, 'Liste ist bereits leer.')
    return
  }
  if (match[2]) {
    const matchingStations = globalStationsHelper.getMatchingGlobalStations(match[2])
    stationsHelper.handleMatchingStations(bot, msg, matchingStations, match[2], handleMatchingStation) //can stay part of interface (controller), no extraction required
  } else {
    handleDeleteCompleteListRequest(bot, msg); //can stay part of Interface (Controller, no extraction required)
  }
}

//Controller-Function
function handleDeleteCompleteListRequest(bot, msg) {
  bot.sendMessage(msg.chat.id, 'gesamte Liste löschen?', secondDeleteCompleteListRequest());
  bot.once('callback_query', query => handleSecondDeleteCompleteListRequest(bot, msg, query));
}

//Controller-Function
function secondDeleteCompleteListRequest() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'JA  \u{1F44D}', callback_data: 'reset' },
          { text: 'NEIN  \u{1F631}', callback_data: 'noreset' }
        ]
      ]
    }
  }
}

//Controller-Function
function handleSecondDeleteCompleteListRequest(bot, msg, query) {
  bot.answerCallbackQuery(query.id);
  if (query.data === 'reset') {
    globalStationsHelper.deleteGlobalStations();
    bot.sendMessage(query.message.chat.id, 'Liste wurde gelöscht', globalStationsHelper.removeKeyboard());
  } else {
    bot.sendMessage(query.message.chat.id, 'Ok, dann nicht.');
  }
}

//Controller-Function
function handleMatchingStation(bot, msg, station) {
  if (globalStationsHelper.globalStationsLength() === 1) {
    globalStationsHelper.deleteGlobalStations()
    bot.sendMessage(msg.chat.id, `${station.name} wurde gelöscht.`,
      globalStationsHelper.removeKeyboard());
  } else {
    globalStationsHelper.removeFromGlobalStations(station);
    bot.sendMessage(msg.chat.id, `${station.name} wurde gelöscht.`,
      globalStationsHelper.globalStationsAsKeyboard());
  }
}
