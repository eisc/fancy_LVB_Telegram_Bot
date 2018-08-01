const TelegramBot = require('node-telegram-bot-api')

let config = require('./config')
const token = config.TELEGRAM_TOKEN

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true})

let globalStations = []
// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id
  const resp = match[1] // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp)
})

// Listen for any kind of message. There are different kinds of
// messages.

bot.onText(/\/start/, (msg) => {
  bot.sendChatAction(msg.chat.id, 'typing')
  bot.sendMessage(msg.chat.id, 'Hallo ' + msg.from.first_name + '\n Ich helfe dir gerne bei den Abfahrtszeiten von Bussen und Bahnen der LVB.\n Bei /help werden dir alle Funktionen dieses Bots aufgelistet.')
})

bot.onText(/\/plan/, (msg) => {
  bot.sendChatAction(msg.chat.id, 'upload_photo')
  bot.sendPhoto(msg.chat.id, 'http://phototrans.de/images/schemas/original/71/914.jpg')
  bot.sendDocument(msg.chat.id, '/home/eiscreme/fancy_LVB_Telegram_Bot/Netzplan_Tag.pdf')
})

bot.onText(/\/add (.+)/, (msg, match) => {
  let parts = match[1]
  globalStations.push(parts)
  bot.sendMessage(msg.chat.id, 'something', {
    'reply_markup': {
      'keyboard': [globalStations]
    }
  }
  )
})

bot.onText(/\/reset (.*)/, (msg, match) => {
  console.log(JSON.stringify(match));
  let parts = match[1]
  console.log('lhgerlk');
})

bot.onText(/\/reset/, (msg) => {
  bot.sendMessage(msg.chat.id, 'something', {
    'reply_markup': {
      'remove_keyboard': true
    }})
})
//
// class OtherwiseController extends Telegram.TelegramBaseController {
//   handle ($) {
//     $.sendChatAction('typing')
//     $.sendMessage('Sorry, try again.')
//   }
// }
//
