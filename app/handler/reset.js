const fetch = require('node-fetch')
const { getGlobalStations, deleteGlobalStations } = require('../helper/globalstations')

exports.handleCommandReset = function (bot, msg, match) {
    if (getGlobalStations().length === 0) {
        bot.sendMessage(msg.chat.id, 'Liste ist bereits leer.')
        return
    }
    if (match[2]) {
        const filteredStations = getGlobalStations()
            .filter(entry => entry.toLowerCase().includes(match[2].toLowerCase()))
        switch (filteredStations.length) {
            case 0:
                bot.sendMessage(msg.chat.id, `${match[2]} steht nicht auf der Liste.`)
                break
            case 1:
                getGlobalStations().length === 1
                    ? bot.sendMessage(msg.chat.id, `${filteredStations[0]} wurde gelöscht.`,
                        {
                            reply_markup: {
                                remove_keyboard: true
                            }
                        })
                    : getGlobalStations().splice(getGlobalStations().indexOf(filteredStations[0]), 1)
                bot.sendMessage(msg.chat.id, `${filteredStations[0]} wurde gelöscht.`, {
                    reply_markup: {
                        keyboard: [getGlobalStations()],
                        resize_keyboard: true
                    }
                })
                break
            default:
                fetch('https://gtfs.leipzig.codefor.de/otp/routers/default/index/stops')
                .then(result => { return result.json() }
                ).then(data => {
                    return Promise.resolve(data
                        .filter(stop => stop.name.toLowerCase().includes(match[2].toLowerCase())))
                }).then(stations => {
                    const stationNames = stations.map(station => { 
                        return [{ text: station.name, callback_data: station.id }] 
                    })
                    if (stationNames.length >= 11) {
                        bot.sendMessage(msg.chat.id, 'Es gibt zu viele Treffer, bitte gib '
                            + 'was genaueres ein.')
                    } else {
                        bot.sendMessage(msg.chat.id, `Es gibt ${stationNames.length} zur Auswahl:`, {
                            reply_markup: {
                                inline_keyboard: stationNames
                            }
                        })
                        bot.on('callback_query', query => {
                            const station = stations.find(station => station.id === query.data)
                            getGlobalStations().splice(getGlobalStations().indexOf(station.name), 1)
                            bot.sendMessage(msg.chat.id, `${station.name} wurde gelöscht.`, {
                                reply_markup: {
                                    keyboard: [getGlobalStations()],
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
                inline_keyboard: [
                    [
                        { text: 'JA  \u{1F44D}', callback_data: 'reset' }, 
                        { text: 'NEIN  \u{1F631}', callback_data: 'noreset' }]
                ]
            }
        })
        bot.on('callback_query', query => {
            if (query.data === 'reset') {
                bot.answerCallbackQuery(query.id)
                if (getGlobalStations().length === 0) {
                    bot.sendMessage(msg.chat.id, 'Liste ist bereits leer.')
                    return
                }
                deleteGlobalStations()
                bot.sendMessage(query.message.chat.id, 'Liste wurde gelöscht', {
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
            } else {
                bot.answerCallbackQuery(query.id)
                bot.sendMessage(query.message.chat.id, 'Ok, dann nicht.')
            }
        })
    }
}
