const fetch = require('node-fetch')
const cache = require('node-cache')

exports.handleCommandStation = function (bot, msg, match) {
    if (match[2] === '') {
        bot.sendMessage(msg.chat.id, 'Bitte gib eine Haltestelle ein.')
    } else {
        fetch('https://gtfs.leipzig.codefor.de/otp/routers/default/index/stops').then(
            result => { return result.json() }
        ).then(data => {
            return Promise.resolve(data
                .filter(stop => stop.name.toLowerCase().includes(match[2].toLowerCase())))
        }).then(stations => {
            const stationNames = stations.map(station => { 
                return [{ text: station.name, callback_data: station.id }] })
            console.log(stationNames, stationNames.length === 1)
            if (stationNames.length >= 11) {
                bot.sendMessage(msg.chat.id, 'Es gibt zu viele Treffer, bitte gib was genaueres ein.')
            } else if (stationNames.length === 1) {
                bot.sendMessage(msg.chat.id, 
                    `Das sind die nächsten 10 Abfahrten für ${stations[0].name}:`)
            } else {
                bot.sendMessage(msg.chat.id, `Es gibt ${stationNames.length} zur Auswahl:`, {
                    reply_markup: {
                        inline_keyboard: stationNames
                    }
                })
                bot.on('callback_query', query => {
                    const station = stations.find(station => station.id === query.data)
                    bot.answerCallbackQuery(query.id)
                    bot.sendMessage(msg.chat.id, 
                        `Das sind die nächsten 10 Abfahrten für ${station.name}:`)
                })
            }
        })
    }
}