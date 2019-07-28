const planstore = require('../helper/planstore')

exports.commandRegex = /\/plan/

exports.registerListener = function (bot) {
  bot.onText(commandRegex, msg => handleCommandPlan(bot, msg.chat.id))
}

exports.handleCommandPlan = function (bot, chatId) {
  bot.sendMessage(msg.chat.id, 'Welchen Netzplan möchtest du haben?', getPlanSelection())
  bot.once('callback_query', query => handlePlanSelection(bot, msg, query))
}

function getPlanSelection() {
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

function handlePlanSelection(bot, chatId, query) {
  bot.answerCallbackQuery(query.id)
  bot.sendChatAction(chatId, 'upload_document')
  bot.sendDocument(chatId, planstore.getPlanPath(query.data), planstore.getPlanAsDocument(query.data))
}

exports.handleInline = function (bot, chatId) {
  const list = [
      {
          id: '0',
          type: 'article',
          title: 'Plan',
          message_text: 'Netzplanabrufen wird im Inline-Mode (noch) nicht unterstützt'
      }
  ]
  bot.answerInlineQuery(chatId, list);
}