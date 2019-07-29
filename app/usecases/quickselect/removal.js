const globalStations = require('../../helper/stations/global')
const selection = require('../../helper/stations/selection/selection')
const selectable = require('../../helper/stations/selection/selectable')

const commandRegex = /\/reset(\s*)(.*)/

function registerListener (bot) {
    bot.onText(commandRegex, (msg, match) => handleCommandReset (bot, msg.chat.id, match[2]))
}

function handleCommandReset (bot, chatId, station) {
  if (globalStations.globalStationsLength() === 0) {
    bot.sendMessage(chatId, 'Liste ist bereits leer.')
    return
  }
  if (station) {
    const matchingStations = globalStations.getMatchingGlobalStations(station)
    handleMatchingStations(bot, chatId, matchingStations, station)
  } else {
    handleDeleteCompleteListRequest(bot, chatId);
  }
}

function handleMatchingStations (bot, chatId, stations, station) {
  const message = selection.getMessageForMatchingStations(station, requestString)
  if (message) {
    bot.sendMessage(chatId, message)
  } else if (stations.length === 1) {
    handleMatchingStation(bot, chatId, stations[0])
  } else {
    handleMultipleMatchingStations(bot, chatId, stations);
  }
}

function handleMultipleMatchingStations(bot, chatId, stations) {
  const offer = selectable.offerMatchingStationsForSelection(stations);
  bot.sendMessage(chatId, `Meintest du eine dieser ${stations.length} Haltestellen?`, offer);
  bot.on('callback_query', query => {
    const station = stations.find(station => station.id === query.data);
    bot.answerCallbackQuery(query.id);
    if (station) {
      handleMatchingStation(bot, chatId, station)
    }
  });
}

function handleDeleteCompleteListRequest(bot, chatId) {
  bot.sendMessage(chatId, 'gesamte Liste löschen?', secondDeleteCompleteListRequest());
  bot.once('callback_query', query => handleSecondDeleteCompleteListRequest(bot, query));
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

function handleSecondDeleteCompleteListRequest(bot, query) {
  bot.answerCallbackQuery(query.id);
  if (query.data === 'reset') {
    globalStations.deleteGlobalStations();
    bot.sendMessage(query.message.chat.id, 'Liste wurde gelöscht', globalStations.removeKeyboard());
  } else {
    bot.sendMessage(query.message.chat.id, 'Ok, dann nicht.');
  }
}

function handleMatchingStation(bot, msg, station) {
  if (globalStations.globalStationsLength() === 1) {
    globalStations.deleteGlobalStations()
    bot.sendMessage(msg.chat.id, `${station.name} wurde gelöscht.`,
    globalStations.removeKeyboard());
  } else {
    globalStations.removeFromGlobalStations(station);
    bot.sendMessage(msg.chat.id, `${station.name} wurde gelöscht.`,
    globalStations.globalStationsAsKeyboard());
  }
}

module.exports = Object.freeze({
  commandRegex,
  registerListener
});