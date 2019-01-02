exports.getMatchingStations = function (stations, charSequence) {
    return stations.filter(stop => stationIncludesStringInName(stop, charSequence))
}

function stationIncludesStringInName(station, charSequence) {
    return station.name.toLowerCase().includes(charSequence.toLowerCase())
}

exports.handleMatchingStations = function (bot, msg, stations, requestString,
    handleMatchingStationFun) {
    if (tooManyStationsFound(stations)) {
        bot.sendMessage(msg.chat.id, 'Es gibt zu viele Treffer, bitte gib was genaueres ein.')
    } else if (noStationsFound(stations)) {
        bot.sendMessage(msg.chat.id, `${requestString} nicht gefunden.`)
    } else if (stations.length === 1) {
        handleMatchingStationFun(bot, msg, stations[0])
    } else {
        handleMultipleMatchingStations(bot, msg, stations, handleMatchingStationFun);
    }
}

function handleMultipleMatchingStations(bot, msg, stations, handleMatchingStationFun) {
    const selectableStationNames = transformToSelectableStationNames(stations);
    bot.sendMessage(msg.chat.id, 
        `Meintest du eine dieser ${selectableStationNames.length} Haltestellen?`,
        offerMatchingStationsForSelection(selectableStationNames));
    const handled = [];    
    bot.on('callback_query', query => {
        const station = stations.find(station => station.id === query.data);
        bot.answerCallbackQuery(query.id);
        if (station && handled.indexOf(station) === -1) {
            handled.push(station)
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

function noStationsFound(stations) {
    return stations.length === 0;
}

function tooManyStationsFound(stations) {
    return stations.length >= 11;
}

function transformToSelectableStationNames(stations) {
    return stations.map(station => {
        return [{ text: station.name, callback_data: station.id }];
    });
}