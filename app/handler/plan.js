const jmap = require('../../config/maps.json')

exports.handleCommandPlan = function (bot, msg) {
  bot.sendMessage(msg.chat.id, 'Welchen Netzplan möchtest du haben?', getPlanSelection())
  bot.once('callback_query', query => handlePlanSelection(bot, msg, query))
}

function getPlanSelection () {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Gesamtnetz Leipzig', callback_data: '0' },
          { text: 'Liniennetz Nacht', callback_data: '1' }
        ],
        [
          { text: 'Stadtplan Leipzig', callback_data: '2' },
          { text: 'Tarifzonenplan MDV', callback_data: '3' }
        ]
      ]
    }
  }
}

function handlePlanSelection (bot, msg, query) {
  bot.answerCallbackQuery(query.id)
  bot.sendChatAction(msg.chat.id, 'upload_document')
  bot.sendDocument(msg.chat.id, jmap[query.data].path, getPlanAsDocument(query))
}

function getPlanAsDocument (query) {
  return {
    caption: `*${jmap[query.data].title}*\n${jmap[query.data].description}`,
    parse_mode: 'Markdown'
  }
}
