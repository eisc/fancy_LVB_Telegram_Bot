const planstore = require('../helper/planstore')

const commandRegex = /\/plan/

function registerListener (bot) {
  bot.onText(commandRegex, msg => handleCommandPlan(bot, msg.chat.id))
}

function handleCommandPlan (bot, chatId) {
  bot.sendMessage(chatId, 'Welchen Netzplan möchtest du haben?', getPlanSelection())
}

function getPlanSelection() {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Gesamtnetz Leipzig', callback_data: getPlanSelectionPayload('0') },
          { text: 'Liniennetz Nacht', callback_data: getPlanSelectionPayload('1') }
        ],
        [
          { text: 'Stadtplan Leipzig', callback_data: getPlanSelectionPayload('2') },
          { text: 'Tarifzonenplan MDV', callback_data: getPlanSelectionPayload('3') }
        ]
      ]
    }
  }
}

function getPlanSelectionPayload (selectionIndex) {
  return JSON.stringify({
    planSelection: selectionIndex
  }, null, 2)
}

function canHandleCallback(query) {
  const payload = query.data && JSON.parse(query.data)
  return payload && payload.planSelection
}

function handleCallback(bot, chatId, query) {
  const planSelection = canHandleCallback(query)
  if (planSelection) {
    bot.answerCallbackQuery(query.id)
    bot.sendChatAction(chatId, 'upload_document')
    bot.sendDocument(chatId, planstore.getPlanPath(planSelection),
      planstore.getPlanAsDocument(planSelection))
  }
}

function handleInline (bot, chatId) {
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

module.exports = Object.freeze({
  commandRegex,
  registerListener,
  handleInline,
  canHandleCallback,
  handleCallback
});