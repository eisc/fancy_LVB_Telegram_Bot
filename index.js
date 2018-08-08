const TelegramBot = require('node-telegram-bot-api')

let config = require('./config')
const token = config.TELEGRAM_TOKEN

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true})

let globalStations = []

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
  bot.sendMessage(msg.chat.id, `${parts} wurde hinzugefügt.`, {
    reply_markup: {
      keyboard: [globalStations]
    }
  }
  )
})

bot.onText(/\/reset(\s*)(.*)/, (msg, match) => {
  let parts = match[2]
  let index = globalStations.indexOf(parts)
  if (parts) {
    if (index === -1) {
      bot.sendMessage(msg.chat.id, `${parts} steht nicht auf der Liste`)
      return
    }
    globalStations.splice(index, 1)
    console.log(globalStations)
    bot.sendMessage(msg.chat.id, `${parts} wurde gelöscht.`, {
      reply_markup: {
        keyboard: [globalStations]
      }
    })
  } else {
    bot.sendMessage(msg.chat.id, 'reset the whole list?', {
      reply_markup: {
        inline_keyboard: [ [ {text: 'yes', callback_data: 'reset'}, {text: 'no', callback_data: 'noreset'} ]
        ],
        one_time_keyboard: true
      }
    })
  }
})

bot.on('callback_query', query => {
  if (query.data === 'reset') {
    bot.sendMessage(query.message.chat.id, 'Liste gelöscht', {
      reply_markup: {
        remove_keyboard: true
      }
    })
  }
})
