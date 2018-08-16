const TelegramBot = require('node-telegram-bot-api')

let config = require('./config')
const token = config.TELEGRAM_TOKEN

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true})

let globalStations = []

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Hallo ' + msg.from.first_name + '!\nIch helfe dir gerne bei den Abfahrtszeiten von Bussen und Bahnen der LVB.\nBei /help werden dir alle Funktionen dieses Bots aufgelistet.')
})

bot.onText(/\/plan/, (msg) => {
  bot.sendChatAction(msg.chat.id, 'upload_photo')
  bot.sendPhoto(msg.chat.id, 'http://phototrans.de/images/schemas/original/71/914.jpg')
  bot.sendDocument(msg.chat.id, '/home/eiscreme/fancy_LVB_Telegram_Bot/Netzplan_Tag.pdf')
})

bot.onText(/\/add(\s*)(.*)/, (msg, match) => {
  let parts = match[2]
  if (parts === '') {
    bot.sendMessage(msg.chat.id, 'Bitte gib eine Haltestelle ein.')
    return
  }
  globalStations.push(parts)
  bot.sendMessage(msg.chat.id, `${parts} wurde hinzugefügt.`, {
    reply_markup: {
      keyboard: [globalStations],
      resize_keyboard: true
    }
  }
  )
})

bot.onText(/\/reset(\s*)(.*)/, (msg, match) => {
  let parts = match[2]
  let index = globalStations.indexOf(parts)
  if (globalStations.length === 0) {
    bot.sendMessage(msg.chat.id, 'Liste ist bereits leer.')
    return
  }
  if (parts) {
    if (index === -1) {
      bot.sendMessage(msg.chat.id, `${parts} steht nicht auf der Liste`)
      return
    }
    globalStations.splice(index, 1)
    if (globalStations.length === 0) {
      bot.sendMessage(msg.chat.id, `${parts} wurde gelöscht.`, {
        reply_markup: {
          remove_keyboard: true
        }
      })
      return
    }
    bot.sendMessage(msg.chat.id, `${parts} wurde gelöscht.`, {
      reply_markup: {
        keyboard: [globalStations],
        resize_keyboard: true
      }
    })
  } else {
    bot.sendMessage(msg.chat.id, 'gesamte Liste löschen?', {
      reply_markup: {
        inline_keyboard: [ [ {text: 'JA  \u{1F44D}', callback_data: 'reset'}, {text: 'NEIN  \u{1F631}', callback_data: 'noreset'} ]
        ]
      }
    })
    bot.on('callback_query', query => {
      if (query.data === 'reset') {
        bot.answerCallbackQuery(query.id)
        globalStations.length = 0
        bot.sendMessage(query.message.chat.id, 'Liste wurde gelöscht', {
          reply_markup: {
            remove_keyboard: true
          }
        })
      } else {
        bot.answerCallbackQuery(query.id)
        bot.sendMessage(query.message.chat.id, 'Abbruch')
      }
    })
  }
})

bot.onText(/\/location/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Bitte schick mir deinen Standort.', {
    reply_markup: {
      keyboard: [ [ {text: 'Standort senden', request_location: true}, {text: 'Nein, lieber nicht.'} ] ],
      one_time_keyboard: true,
      resize_keyboard: true
      // Problem: Kurzwahlliste wird von diesem Keyboard überschrieben
    }
  })
})
bot.onText(/Nein, lieber nicht./, (msg) => {
  bot.sendMessage(msg.chat.id, 'Ok, dann nicht. Du kannst mit /station auch direkt nach einer Haltestelle suchen.', {
    reply_markup: {
      remove_keyboard: true
    }
  })
})
bot.on('location', (msg) => {
  console.log(msg.location)
  let {latitude, longitude} = msg.location
  bot.sendMessage(msg.chat.id, 'Danke.', {
    reply_markup: {
      remove_keyboard: true
    }
  })
  // nächstgelegenen Haltestellen
  // bot.sendVenue(msg.chat.id, latitude, longitude, 'Die nächsten Haltestellen sind hier:')
})

bot.onText(/\/station(\s*)(.*)/, (msg, match) => {
  let station = match[2]
  if (station === '') {
    bot.sendMessage(msg.chat.id, 'Bitte gib eine Haltestelle ein.')
    return
  }
  // let lat = lat.station
  // let lon = lon.station
  bot.sendVenue(msg.chat.id, 51.325209, 12.400980, `${station}`, 'Linien:')
})
