const fetch = require('node-fetch')
const cache = require('node-cache')
const { getGlobalStations, addGlobalStation } = require('../helper/globalstations')

exports.handleCommandAdd = function (bot, msg, match) {
  if (match[2] === '') {
    bot.sendMessage(msg.chat.id, 'Bitte gib eine Haltestelle ein.')
    return
  }
  fetch('https://gtfs.leipzig.codefor.de/otp/routers/default/index/stops').then(
    result => { return result.json() }
  ).then(data => {
    return Promise.resolve(data
      .filter(stop => stop.name.toLowerCase().includes(match[2].toLowerCase())))
  }).then(stations => {
    const stationNames = stations.map(station => {
      return [{ text: station.name, callback_data: station.id }]
    })
    if (stationNames.length >= 11) {
      bot.sendMessage(msg.chat.id, 'Es gibt zu viele Treffer, bitte gib was genaueres ein.')
    } else if (stationNames.length === 1) {
      if (getGlobalStations().includes(stations[0].name)) {
        bot.sendMessage(msg.chat.id, `${stations[0].name} steht bereits auf der Liste.`)
      } else {
        addGlobalStation(stations[0].name)
        bot.sendMessage(msg.chat.id, `${stations[0].name} wurde hinzugefügt.`, {
          reply_markup: {
            keyboard: [getGlobalStations()],
            resize_keyboard: true
          }
        })
      }
    } else if (stationNames.length === 0) {
      bot.sendMessage(msg.chat.id, `${match[2]} ist keine Haltestelle.`)
    } else {
      bot.sendMessage(msg.chat.id, `Meintest du eine dieser ${stationNames.length} Haltestellen?`,
        {
          reply_markup: {
            inline_keyboard: stationNames
          }
        })
      bot.on('callback_query', query => {
        const station = stations.find(station => station.id === query.data)
        bot.answerCallbackQuery(query.id)
        if (getGlobalStations().includes(station.name)) {
          bot.sendMessage(msg.chat.id, `${station.name} steht bereits auf der Liste.`)
        } else {
          addGlobalStation(station.name)
          bot.sendMessage(msg.chat.id, `${station.name} wurde hinzugefügt.`, {
            reply_markup: {
              keyboard: [getGlobalStations()],
              resize_keyboard: true
            }
          })
        }
      })
    }
  })
}
