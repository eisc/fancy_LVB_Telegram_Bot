const TelegramBot = require('node-telegram-bot-api')

let config = require('./config')
let data = require('./data')

const token = config.TELEGRAM_TOKEN

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true})

let globalStations = []

bot.onText(/\/start/, (msg) => {
  bot.sendChatAction(msg.chat.id, 'typing')
  bot.sendMessage(msg.chat.id, 'Hallo ' + msg.from.first_name + '!\nIch helfe dir gerne bei den Abfahrtszeiten von Bussen und Bahnen der LVB.\nBei /help werden dir alle Funktionen dieses Bots aufgelistet.')
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

bot.onText(/\/departure(\s*)(.*)/, (msg, match) => {
  if (match[2] === '') {
    bot.sendMessage(msg.chat.id, 'Bitte gib eine Haltestelle ein.')
    return
  }
  const stopName = match[2];
  const stations = data.getStationsByName(stopName, 5)
  stations.forEach(station => handleStation(msg, station));
})

function handleStation(msg, station) {
  data.getArrivalsByStopId(station.stop_id, 10).forEach(
    departure => handleDeparture(msg, station, departure)
  )
}

function handleDeparture(msg, station, departureResults) {
  if(departureResults.length) {
    console.log("departures: ", departures)
    departureResults.forEach(res => {
      if(res.line) {
        var answer = `Abfahrt ab ${station.stop_name} von ${res.line.name} in Richtung ${res.line.direction}`;
        if(res.timetable) {
          answer += '\n';
          res.timetable.forEach(time => {
            answer += handleDepartureTime(time);
          })
        } else {
          answer += '- Keine Abfahrtszeiten verfügbar für ' + station.stop_name;
        }
        bot.sendMessage(msg.chat.id, answer);
      } else {
        bot.sendMessage(msg.chat.id, 'Keine Linieninformationen verfügbar');
      }
    })
  } else {
    bot.sendMessage(msg.chat.id, 'Keine aktuellen Abfahrten gefunden für ' + station.stop_name);
  }
}

function handleDepartureTime(time) {
  const depTime = new Date(Date.parse(time.departure));
  const departureStr = moment(depTime).format('HH:mm:ss');
  var answer = `- um ${departureStr}`;
  if(time.departureDelay != 0) {
    const delay = new Date(time.departureDelay);
    const delayStr = moment(delay).format('mm:ss');
    answer += ` mit einer Verspätung von ${delayStr} Minuten`;
  }
  answer += '\n';
  return answer;
}