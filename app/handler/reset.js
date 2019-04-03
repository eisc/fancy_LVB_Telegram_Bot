const globalStationsHelper = require('../helper/globalstations')
const stationsHelper = require('../helper/stations')

exports.handleCommandReset = function (bot, msg, match) {
  if (globalStationsHelper.globalStationsLength() === 0) {
    bot.sendMessage(msg.chat.id, 'Liste ist bereits leer.')
    return
  }
  if (match[2]) {
    const matchingStations = globalStationsHelper.getMatchingGlobalStations(match[2])
    stationsHelper.handleMatchingStations(bot, msg, matchingStations, match[2], handleMatchingStation)
  } else {
    handleDeleteCompleteListRequest(bot, msg);
  }
}

function handleDeleteCompleteListRequest(bot, msg) {
  bot.sendMessage(msg.chat.id, 'gesamte Liste löschen?', secondDeleteCompleteListRequest());
  bot.once('callback_query', query => handleSecondDeleteCompleteListRequest(bot, msg, query));
}

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

function handleSecondDeleteCompleteListRequest(bot, msg, query) {
  bot.answerCallbackQuery(query.id);
  if (query.data === 'reset') {
    globalStationsHelper.deleteGlobalStations();
    bot.sendMessage(query.message.chat.id, 'Liste wurde gelöscht', globalStationsHelper.removeKeyboard());
  } else {
    bot.sendMessage(query.message.chat.id, 'Ok, dann nicht.');
  }
}

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
