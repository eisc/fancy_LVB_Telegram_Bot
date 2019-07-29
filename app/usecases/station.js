
//import names should be the module-names, now it is very difficult to follow
const gtfsStations = require('../helper/stations/gtfs')
const stationsMatcher = require('../helper/stations/matcher')
const stationsNormalizer = require('../helper/stations/normalizer')
const lvbDeparure = require('../helper/departures/fetcher/lvb')
const gtfsDeparture = require('../helper/departures/fetcher/gtfs')
const query = require('../helper/departures/query')
const selection = require('../helper/stations/selection/selection')
const selectable = require('../helper/stations/selection/selectable')

const commandRegex = /^((?!(\/start|\/help|\/plan|\/add|\/context|\/reset)).)*$/

function registerListener (bot, contextResolver) {
  bot.onText(commandRegex, (msg, match) => handlePotentialStation(bot, msg.chat.id, match[0], contextResolver))
}

function handlePotentialStation (bot, chatId, station, contextResolver) {
  const allStops = gtfsStations.fetchAllStops()
  const matchingStations = stationsMatcher.getMatchingStations(allStops, station, contextResolver)
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

function handleMatchingStation (bot, msg, station) {
  if(station.mappedStations && station.mappedStations.length > 0) {
    handleMultipleMatchingStations(bot, msg, station)
  } else {
    handleSingleMatchingStation(bot, msg, station)
  }
}

function handleSingleMatchingStation (bot, msg, station) {
  if (station.name.includes(' ZUG')) {
    gtfsDeparture.getDeparturesForStation(bot, msg, station)
  } else {
    lvbDeparure.getDeparturesForStation(bot, msg, station);
  }
}

function handleMultipleMatchingStations (bot, msg, station) {
  const calls = collectDepartureCalls(bot, msg, station.mappedStations)
  Promise.all(calls).then(departureLists => {
    const departures = flatMapDepartureLists (departureLists)
    query.handleDeparture(bot, msg, station, departures)
  }).catch(function(error) {
    bot.sendMessage(msg.chat.id, 'Fehler ' + error.message)
  })
}

function collectDepartureCalls (bot, msg, stations) {
  const calls = []
  stations.forEach(station => {
    if (station.name.includes(' ZUG')) {
      calls.push(gtfsDeparture.getDeparturesForStationPromise(bot, msg, station)
        .catch(() => []))
    } else {
      calls.push(lvbDeparure.getDeparturesForStationPromise(station)
        .catch(() => []))
    }
  })
  return calls
}

function flatMapDepartureLists (departureLists) {
  const departures = []
  departureLists.forEach(departureList => {
    departureList.forEach(departure => {
      if (!departures.includes(departure)) {
        departures.push(departure)
      }
    })
  })
  return departures
}

function handleInline (bot, data) {
  var content = data.query;
  if (content.startsWith("/")) {
      return;
  }
  console.log(content);
  const list = [
      {
          id: '0',
          type: 'article',
          title: 'Gerichtsweg',
          message_text: 'Abfahrt Gerichtsweg'
      },
      {
          id: '1',
          type: 'article',
          title: 'Münzgasse',
          message_text: 'Abfahrt Münzgasse'
      },
      {
          id: '2',
          type: 'article',
          title: 'Steinweg',
          message_text: 'Abfahrt Steinweg'
      }
  ]
  // examples:
  // * https://github.com/yagop/node-telegram-bot-api/issues/557
  // * https://github.com/yagop/node-telegram-bot-api/issues/729
  // *

  /*     interface InlineQueryResultBase {
          id: string;
          reply_markup?: InlineKeyboardMarkup;
      }

      interface InlineQueryResultArticle extends InlineQueryResultBase {
          type: 'article';
          title: string;
          input_message_content: InputMessageContent;
          url?: string;
          hide_url?: boolean;
          description?: string;
          thumb_url?: string;
          thumb_width?: number;
          thumb_height?: number;
      } */

  // todos
  // * take data.query string, fetch stations, display
  bot.answerInlineQuery(data.id, list);
  // to send message to bot directly
  //bot.sendMessage(data.from.id, "hello world");
}

module.exports = Object.freeze({
  commandRegex,
  registerListener,
  handleMatchingStation,
  handleInline
});