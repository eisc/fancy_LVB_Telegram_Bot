const stationsHelper = require('../helper/stations')

exports.handleInlineQuery = function (bot, msg, contextResolver) {
  var match = [msg.query]
  createAnswerForInlineQuery(bot, msg, match, contextResolver).then(
    inlineAnswers => bot.answerInlineQuery(msg.id, inlineAnswers)
  )
}

function createAnswerForInlineQuery (bot, msg, match, contextResolver) {
  return new Promise((resolve, reject) => {
    stationsHelper.getAllStations(bot, msg, match, contextResolver)
      .then(stations => {
        const formattedStations = stations.map(station => createAnswer(station))
        return resolve(formattedStations)
      })
  })
}

function createAnswer (station) {
  return {
    type: 'article',
    id: station.id,
    title: station.name,
    input_message_content: {
      message_text: 'departure table'
    }
  }
}
