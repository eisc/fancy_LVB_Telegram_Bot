const moment = require('moment')
var table = require('text-table')


exports.handleDeparture = function (bot, msg, station, departureResults) {
    if (departureResults.length) {
            var answer = createAnswerForDepartureResult(station, departureResults).slice(0, 10)
            bot.sendMessage(msg.chat.id, `Abfahrten für *${station.name}*\n${"`"}${table(answer, { align: ['r', 'l', 'r'] })}${"`"}`,
            { parse_mode: 'Markdown',
              reply_markup: {
                inline_keyboard: [[{ text: 'mehr anzeigen', callback_data: 'more' }]]
              } })
              bot.once('callback_query', query => {
                bot.answerCallbackQuery(query.id)
                if (query.data === 'more') {
                  var answer = createAnswerForDepartureResult(station, departureResults).slice(0, 20)
                  bot.sendMessage(msg.chat.id, `Abfahrten für *${station.name}*\n${"`"}${table(answer, { align: ['r', 'l', 'r'] })}${"`"}`, { parse_mode: 'Markdown' })
                }
              })
    } else {
      bot.sendMessage(msg.chat.id, `Keine aktuellen Abfahrten für *${station.name}* gefunden.`, { parse_mode: 'Markdown' })
    }
}

function createAnswerForDepartureResult(station, departureResults) {
var departure = []
departureResults.forEach(res => {
  res.timetable.forEach(time => {
    departure.push([res.line.id,
    res.line.direction,
    handleDepartureTime(time),
    handleDelay(time)])
  })
})
departure.sort((entry1, entry2) => entry1[2] - entry2[2])
return departure
}

function handleDepartureTime(time) {
    const depTime = new Date(Date.parse(time.departure))
    var departureInMinutes = Math.floor(moment.duration(moment(depTime).diff(moment())).as('minutes'))
    if (departureInMinutes === 0) {
      return ''
    }
    return departureInMinutes
}

function handleDelay(time) {
    const delay = new Date(time.departureDelay)
    const delayMinutes = delay.getMinutes()
    if (delayMinutes > 0) {
        return ` +${delayMinutes}`
    }
    return ''
}
