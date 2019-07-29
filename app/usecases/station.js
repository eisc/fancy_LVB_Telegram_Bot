
//import names should be the module-names, now it is very difficult to follow
const gtfsStations = require('../helper/stations/gtfs')
const stationsMatcher = require('../helper/stations/matcher')
const stationsNormalizer = require('../helper/stations/normalizer')
const departureCollector = require('../helper/departures/collector')
const departureQuery = require('../helper/departures/query')
const selection = require('../helper/stations/selection/selection')
const selectable = require('../helper/stations/selection/selectable')

const commandRegex = /^((?!(\/start|\/help|\/plan|\/add|\/context|\/reset)).)*$/

function registerListener (bot, contextResolver) {
  bot.onText(commandRegex, (msg, match) => handlePotentialStation(bot, msg.chat.id, match[0], contextResolver))
}

async function handlePotentialStation (bot, chatId, station, contextResolver) {
  const allStops = await gtfsStations.fetchAllStops()
  const matchingStations = stationsMatcher.getMatchingStations(allStops, station, contextResolver)
  const formattedStations = matchingStations.map(station => {
    station.name = stationsNormalizer.normalizeStationName(station)
    return station
  })
  handleMatchingStations(bot, chatId, formattedStations, station)
}

async function handleMatchingStations (bot, chatId, stations, station) {
  const message = selection.getMessageForMatchingStations(stations, station)
  if (message) {
    bot.sendMessage(chatId, message)
  } else if (stations.length === 1) {
    const foundStation = stations[0]
    const departures = await departureCollector.collectDepartures(foundStation)
    departureQuery.handleDeparture(bot, chatId, foundStation, departures)
  } else {
    handleMultipleMatchingStations(bot, chatId, stations);
  }
}

function handleMultipleMatchingStations(bot, chatId, stations) {
  const offer = selectable.offerMatchingStationsForSelection(stations);
  bot.sendMessage(chatId, `Meintest du eine dieser ${stations.length} Haltestellen?`, offer);
  bot.once('callback_query', query => {
    const station = stations.find(station => station.id === query.data);
    bot.answerCallbackQuery(query.id);
    if (station) {
      const departures = departureCollector.collectDepartures(station)
      departureQuery.handleDeparture(bot, chatId, station, departures)
    }
  });
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
  handleInline
});