const { getGlobalStations, globalStationsAsKeyboard, removeFromGlobalStation, deleteGlobalStations }
    = require('../helper/globalstations')
const { getMatchingStations, handleMatchingStations } = require('../helper/stations')

exports.handleCommandReset = function (bot, msg, match) {
    if (getGlobalStations().length === 0) {
        bot.sendMessage(msg.chat.id, 'Liste ist bereits leer.')
        return
    }
    if (match[2]) {
        const stations = getGlobalStations().map(stationName => toStationObject(stationName))
        const matchingStations = getMatchingStations(stations, match[2])
        handleMatchingStations(bot, msg, matchingStations, match[2], handleMatchingStation)
    } else {
        handleDeleteCompleteListRequest(bot, msg);
    }
}

function toStationObject(stationName) {
    return { name: stationName }
}

function handleDeleteCompleteListRequest(bot, msg) {
    bot.sendMessage(msg.chat.id, 'gesamte Liste löschen?', secondDeleteCompleteListRequest());
    bot.on('callback_query', query => handleSecondDeleteCompleteListRequest(bot, msg, query));
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
        if (getGlobalStations().length === 0) {
            bot.sendMessage(msg.chat.id, 'Liste ist bereits leer.');
            return;
        }
        deleteGlobalStations();
        bot.sendMessage(query.message.chat.id, 'Liste wurde gelöscht', removeKeyboard());
    } else {
        bot.sendMessage(query.message.chat.id, 'Ok, dann nicht.');
    }
}

function handleMatchingStation(bot, msg, station) {
    getGlobalStations().length === 1
        ? bot.sendMessage(msg.chat.id, `${station.name} wurde gelöscht.`, removeKeyboard())
        : removeFromGlobalStation(station.name);
    bot.sendMessage(msg.chat.id, `${station.name} wurde gelöscht.`, globalStationsAsKeyboard());
}

function removeKeyboard() {
    return {
        reply_markup: {
            remove_keyboard: true
        }
    }
}
