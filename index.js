process.env['NTBA_FIX_319'] = 1
const TelegramBot = require('node-telegram-bot-api')
const fetch = require('node-fetch')
const moment = require('moment')
const cache = require('node-cache')
const stations = require('lvb').stations
const departures = require('lvb').departures

let config = require('./config')
const token = config.TELEGRAM_TOKEN

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true })

let jmap = require('./maps.json')

let globalStations = []

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Hallo ' + msg.from.first_name + '!\nIch helfe dir gerne bei den Abfahrtszeiten von Bussen und Bahnen der LVB.\nBei /help werden dir alle Funktionen dieses Bots aufgelistet.')
})

bot.onText(/\/help/, (msg) => {
  bot.sendMessage(msg.chat.id, 'Hier eine Übersicht über alle Funkionen:\n\n• Mit /plan bekommst du den Liniennetzplan als PDF geschickt.\n• Mit /add kannst du eine Kurzwahlliste erstellen. Gib dazu einfach en Namen einer Haltestelle ein.\n• Mit /reset kannst du die Kurzwahlliste komplett löschen. Gibst du den Namen einer Haltestelle ein, dann löscht es nur diese aus der Liste.\n• Mit /onlocation kannst du mir deinen Standort senden und dir die 5 nächstgelegenen Haltestellen anzeigen lassen.\n• Bei /station wird dir der Standort einer Haltestelle angezeigt.')
})

bot.onText(/\/plan(\s*)(.*)/, (msg, match) => {
  bot.sendMessage(msg.chat.id, 'Welchen Netzplan möchtest du haben?', {
    reply_markup: {
      inline_keyboard: [ [ { text: 'Gesamtnetz Leipzig', callback_data: '0' }, { text: 'Liniennetz Nacht', callback_data: '1' } ], [ { text: 'Stadtplan Leipzig', callback_data: '2' }, { text: 'Tarifzonenplan MDV', callback_data: '3' } ]
      ]
    }
  })
  bot.on('callback_query', query => {
    bot.answerCallbackQuery(query.id)
    bot.sendChatAction(msg.chat.id, 'upload_document')
    bot.sendDocument(msg.chat.id, jmap[query.data].path, {
      caption: `*${jmap[query.data].title}*\n${jmap[query.data].description}`,
      parse_mode: 'Markdown'
    })
  })
})

bot.onText(/\/add(\s*)(.*)/, (msg, match) => {
  if (match[2] === '') {
    bot.sendMessage(msg.chat.id, 'Bitte gib eine Haltestelle ein.')
    return
  }
  fetch('https://gtfs.leipzig.codefor.de/otp/routers/default/index/stops').then(
    result => { return result.json() }
  ).then(data => {
    return Promise.resolve(data.filter(stop => stop.name.toLowerCase().includes(match[2].toLowerCase())))
  }).then(stations => {
    const stationNames = stations.map(station => { return [{ text: station.name, callback_data: station.id }] })
    if (stationNames.length >= 11) {
      bot.sendMessage(msg.chat.id, 'Es gibt zu viele Treffer, bitte gib was genaueres ein.')
    } else if (stationNames.length === 1) {
      if (globalStations.includes(stations[0].name)) {
        bot.sendMessage(msg.chat.id, `${stations[0].name} steht bereits auf der Liste.`)
      } else {
        globalStations.push(stations[0].name)
        bot.sendMessage(msg.chat.id, `${stations[0].name} wurde hinzugefügt.`, {
          reply_markup: {
            keyboard: [globalStations],
            resize_keyboard: true
          }
        })
      }
    } else if (stationNames.length === 0) {
      bot.sendMessage(msg.chat.id, `${match[2]} ist keine Haltestelle.`)
    } else {
      bot.sendMessage(msg.chat.id, `Meintest du eine dieser ${stationNames.length} Haltestellen?`, {
        reply_markup: {
          inline_keyboard: stationNames
        }
      })
      bot.on('callback_query', query => {
        const station = stations.find(station => station.id === query.data)
        bot.answerCallbackQuery(query.id)
        if (globalStations.includes(station.name)) {
          bot.sendMessage(msg.chat.id, `${station.name} steht bereits auf der Liste.`)
        } else {
          globalStations.push(station.name)
          bot.sendMessage(msg.chat.id, `${station.name} wurde hinzugefügt.`, {
            reply_markup: {
              keyboard: [globalStations],
              resize_keyboard: true
            }
          })
        }
      }
      )
    }
  })
})

bot.onText(/\/reset(\s*)(.*)/, (msg, match) => {
  if (globalStations.length === 0) {
    bot.sendMessage(msg.chat.id, 'Liste ist bereits leer.')
    return
  }
  if (match[2]) {
    const filteredStations = globalStations.filter(entry => entry.toLowerCase().includes(match[2].toLowerCase()))
    switch (filteredStations.length) {
      case 0:
        bot.sendMessage(msg.chat.id, `${match[2]} steht nicht auf der Liste.`)
        break
      case 1:
        globalStations.length === 1
          ? bot.sendMessage(msg.chat.id, `${filteredStations[0]} wurde gelöscht.`, {
            reply_markup: {
              remove_keyboard: true
            }
          })
          : globalStations.splice(globalStations.indexOf(filteredStations[0]), 1)
        bot.sendMessage(msg.chat.id, `${filteredStations[0]} wurde gelöscht.`, {
          reply_markup: {
            keyboard: [globalStations],
            resize_keyboard: true
          }
        })
        break
      default:
        fetch('https://gtfs.leipzig.codefor.de/otp/routers/default/index/stops').then(
          result => { return result.json() }
        ).then(data => {
          return Promise.resolve(data.filter(stop => stop.name.toLowerCase().includes(match[2].toLowerCase())))
        }).then(stations => {
          const stationNames = stations.map(station => { return [{ text: station.name, callback_data: station.id }] })
          if (stationNames.length >= 11) {
            bot.sendMessage(msg.chat.id, 'Es gibt zu viele Treffer, bitte gib was genaueres ein.')
          } else {
            bot.sendMessage(msg.chat.id, `Es gibt ${stationNames.length} zur Auswahl:`, {
              reply_markup: {
                inline_keyboard: stationNames
              }
            })
            bot.on('callback_query', query => {
              const station = stations.find(station => station.id === query.data)
              globalStations.splice(globalStations.indexOf(station.name), 1)
              bot.sendMessage(msg.chat.id, `${station.name} wurde gelöscht.`, {
                reply_markup: {
                  keyboard: [globalStations],
                  resize_keyboard: true
                }
              })
            })
          }
        })
    }
  } else {
    bot.sendMessage(msg.chat.id, 'gesamte Liste löschen?', {
      reply_markup: {
        inline_keyboard: [ [ { text: 'JA  \u{1F44D}', callback_data: 'reset' }, { text: 'NEIN  \u{1F631}', callback_data: 'noreset' } ]
        ]
      }
    })
    bot.on('callback_query', query => {
      if (query.data === 'reset') {
        bot.answerCallbackQuery(query.id)
        if (globalStations.length === 0) {
          bot.sendMessage(msg.chat.id, 'Liste ist bereits leer.')
          return
        }
        globalStations.length = 0
        bot.sendMessage(query.message.chat.id, 'Liste wurde gelöscht', {
          reply_markup: {
            remove_keyboard: true
          }
        })
      } else {
        bot.answerCallbackQuery(query.id)
        bot.sendMessage(query.message.chat.id, 'Ok, dann nicht.')
      }
    }
    )
  }
})

bot.on('location', (msg) => {
  console.log(msg.location)
  let { latitude, longitude } = msg.location
  bot.sendMessage(msg.chat.id, 'Danke. Das sind die nächsten 5 Haltestellen:', {
    reply_markup: {
      inline_keyboard: [ [ { text: `name`, callback_data: 'db[station.id]}' }, { text: 'Haltestelle 2', callback_data: 'Haltestelle 2' } ]
      ]
    }
  })
  bot.on('callback_query', query => {
    if (query.data === 'db[station.id]') {
      bot.answerCallbackQuery(query.id)
      bot.sendMessage(msg.chat.id, `Das sind die nächsten 10 Abfahrten:`)
    }
  })
})

bot.onText(/\/station(\s*)(.*)/, (msg, match) => {
  if (match[2] === '') {
    bot.sendMessage(msg.chat.id, 'Bitte gib eine Haltestelle ein.')
  } else {
    fetch('https://gtfs.leipzig.codefor.de/otp/routers/default/index/stops').then(
      result => { return result.json() }
    ).then(data => {
      return Promise.resolve(data.filter(stop => stop.name.toLowerCase().includes(match[2].toLowerCase())))
    }).then(stations => {
      const stationNames = stations.map(station => { return [{ text: station.name, callback_data: station.id }] })
      console.log(stationNames, stationNames.length === 1)
      if (stationNames.length >= 11) {
        bot.sendMessage(msg.chat.id, 'Es gibt zu viele Treffer, bitte gib was genaueres ein.')
      } else if (stationNames.length === 1) {
        bot.sendMessage(msg.chat.id, `Das sind die nächsten 10 Abfahrten für ${stations[0].name}:`)
      } else {
        bot.sendMessage(msg.chat.id, `Es gibt ${stationNames.length} zur Auswahl:`, {
          reply_markup: {
            inline_keyboard: stationNames
          }
        })
        bot.on('callback_query', query => {
          const station = stations.find(station => station.id === query.data)
          bot.answerCallbackQuery(query.id)
          bot.sendMessage(msg.chat.id, `Das sind die nächsten 10 Abfahrten für ${station.name}:`)
        })
      }
    })
  }
})

bot.onText(/\/departure(\s*)(.*)/, (msg, match) => {
  if (match[2] === '') {
    bot.sendMessage(msg.chat.id, 'Bitte gib eine Haltestelle ein.')
    return
  }
  const stopName = match[2]
  stations(stopName).then(stations => {
    if (stations.length) {
      stations.forEach(station => handleStation(msg, station))
    } else {
      bot.sendMessage(msg.chat.id, 'Keine Station gefunden für ' + stopName)
    }
  }).catch(error => {
    bot.sendMessage(msg.chat.id, 'Fehler ' + error)
  })
})

function handleDeparture (msg, station, departureResults) {
  if (departureResults.length) {
    departureResults.forEach(res => {
      if (res.line) {
        var answer = `Abfahrt ab ${station.name} von ${res.line.name} in Richtung ${res.line.direction}`
        if (res.timetable) {
          answer += '\n'
          res.timetable.forEach(time => {
            answer += handleDepartureTime(time)
          })
        } else {
          answer += '- Keine Abfahrtszeiten verfügbar für ' + station.name
        }
        bot.sendMessage(msg.chat.id, answer)
      } else {
        bot.sendMessage(msg.chat.id, 'Keine Linieninformationen verfügbar')
      }
    })
  } else {
    bot.sendMessage(msg.chat.id, 'Keine aktuellen Abfahrten gefunden für ' + station.name)
  }
}

function handleStation (msg, station) {
  departures(station.id, new Date()).then(
    departure => handleDeparture(msg, station, departure)
  ).catch(error => {
    bot.sendMessage(msg.chat.id, 'Fehler ' + error)
  })
}

function handleDepartureTime (time) {
  const depTime = new Date(Date.parse(time.departure))
  const departureStr = moment(depTime).format('HH:mm:ss')
  var answer = `- um ${departureStr}`
  if (time.departureDelay !== 0) {
    const delay = new Date(time.departureDelay)
    const delayStr = moment(delay).format('mm:ss')
    answer += ` mit einer Verspätung von ${delayStr} Minuten`
  }
  answer += '\n'
  return answer
}

// fetch(`https://gtfs.leipzig.codefor.de/otp/routers/default/index/stops/${stopid}/stoptimes`).then(
//   result => {return result.json()}
// ).then(console.log)
