let jmap = require('../../config/maps.json')

exports.handleCommandPlan = function (bot, msg) {
    bot.sendMessage(msg.chat.id, 'Welchen Netzplan möchtest du haben?', {
        reply_markup: {
            inline_keyboard: [
                [
                    { text: 'Gesamtnetz Leipzig', callback_data: '0' },
                    { text: 'Liniennetz Nacht', callback_data: '1' }
                ],
                [
                    { text: 'Stadtplan Leipzig', callback_data: '2' },
                    { text: 'Tarifzonenplan MDV', callback_data: '3' }
                ]
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
}
