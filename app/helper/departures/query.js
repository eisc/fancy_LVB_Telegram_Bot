const table = require('./format/table')

exports.handleDeparture = function (bot, chatId, station, departureResults) {
  if (departureResults.length) {
    const departures = table.createAnswerForDepartureResult(departureResults)
    if (departures.length === 0) {
      bot.sendMessage(chatId, `Keine aktuellen Abfahrten für *${station.name}* gefunden.`,
        { parse_mode: 'Markdown' })
    } else {
      var sliceStart = 0
      const sliceSize = 10
      sendDepartureMessage(bot, chatId, station, departures, sliceStart, sliceSize)
    }
  }
}

function sendDepartureMessage (bot, chatId, station, departures, sliceMin, sliceSize) {
  const sliceMax = getSliceMax(departures, sliceMin, sliceSize)
  const answer = departures.slice(sliceMin, sliceMax)
  const departTableStr = table.departureTable(station, answer)
  bot.sendMessage(chatId, departTableStr, moreQuery(departures, sliceMax))
  addCallbackHandler(bot, sliceMax, sliceSize, departures, station, chatId)
}

function addCallbackHandler (bot, sliceStart, sliceSize, departures, station, chatId) {
  if (departures.length <= sliceStart) {
    return
  }
  bot.once('callback_query', query => {
    bot.answerCallbackQuery(query.id)
    if (query.data === `more_departures_${sliceStart}`) {
      sendDepartureMessage(bot, chatId, station, departures, sliceStart, sliceSize)
    }
  })
}

function getSliceMax (departures, sliceMin, sliceSize) {
  const sliceMax = sliceMin + sliceSize
  if (sliceMax > departures.length) {
    return departures.length
  }
  return sliceMax
}

function moreQuery (departures, sliceMax) {
  if (departures.length <= sliceMax) {
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
