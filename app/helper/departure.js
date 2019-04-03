const tableHelper = require('./departuretable')

exports.handleDeparture = function (bot, msg, station, departureResults)
  if (departureResults.length) {
    const departures = tableHelper.createAnswerForDepartureResult(departureResults)
    if(departures.length === 0) {
      bot.sendMessage(msg.chat.id, `Keine aktuellen Abfahrten für *${station.name}* gefunden.`,
        { parse_mode: 'Markdown' })
    } else {
      var sliceStart = 0;
      const sliceSize = 10;
      sendDepartureMessage(bot, msg, station, departures, sliceStart, sliceSize)
    }
  }
}

function sendDepartureMessage(bot, msg, station, departures, sliceMin, sliceSize) {
  const sliceMax = getSliceMax(departures, sliceMin, sliceSize)
  const answer = departures.slice(sliceMin, sliceMax)
  const departTableStr = tableHelper.departureTable(station, answer)
  bot.sendMessage(msg.chat.id, departTableStr, moreQuery(departures, sliceMax));
  addCallbackHandler(bot, sliceMax, sliceSize, departures, station, msg)
}

function addCallbackHandler(bot, sliceStart, sliceSize, departures, station, msg) {
  if(departures.length <= sliceStart) {
    return
  }
  bot.once('callback_query', query => {
    bot.answerCallbackQuery(query.id)
    if (query.data === `more_departures_${sliceStart}`) {
      sendDepartureMessage(bot, msg, station, departures, sliceStart, sliceSize)
    }
  })
}

function getSliceMax(departures, sliceMin, sliceSize) {
  const sliceMax = sliceMin + sliceSize
  if(sliceMax > departures.length) {
    return departures.length
  }
  return sliceMax;
}

function moreQuery(departures, sliceMax) {
  if(departures.length <= sliceMax) {
    return { parse_mode: 'Markdown' }
  }
  return {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[{
        text: 'mehr anzeigen',
        callback_data: `more_departures_${sliceMax}`
      }]]
    }
  }
}