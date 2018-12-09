exports.handleCommandLocation = function (bot, msg) {
    console.log(msg.location)
    let { latitude, longitude } = msg.location
    bot.sendMessage(msg.chat.id, 'Danke. Das sind die nächsten 5 Haltestellen:', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: `name`, callback_data: 'db[station.id]}' },
                    { text: 'Haltestelle 2', callback_data: 'Haltestelle 2' }
                ]
            ]
        }
    })
    bot.on('callback_query', query => {
        if (query.data === 'db[station.id]') {
            bot.answerCallbackQuery(query.id)
            bot.sendMessage(msg.chat.id, `Das sind die nächsten 10 Abfahrten:`)
        }
    })
}
