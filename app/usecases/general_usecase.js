const { START, HELP } = require('../events/events')

exports.registerListener = function (eventbus, bot) {
    eventbus.on(START.eventType, (payload) => {
        sendMessage(bot, payload, 'Hallo ' + payload.firstName
            + '!\nIch helfe dir gerne bei den Abfahrtszeiten von Bussen und Bahnen der LVB.'
            + '\nBei /help werden dir alle Funktionen dieses Bots aufgelistet.')
    });
    eventbus.on(HELP.eventType, (payload) => {
        sendMessage(bot, payload, 'Hier eine Übersicht über alle Funkionen:'
            + '\n\n• Tippe einfach einen Haltestellennamen oder einen Teil davon ein um die'
            + 'Abfahrten dort angezeigt zu bekommen.\n'
            + '• Mit /add kannst du eine Kurzwahlliste erstellen.\n'
            + '• Mit /reset kannst du die Kurzwahlliste löschen. Gibst du den Namen einer '
            + 'Haltestelle ein, dann löscht es nur diese aus der Liste.\n'
            + '• Sende mir deinen Standort ich zeige dir die 5 nächstgelegenen Haltestellen.\n'
            + '• Mit /station kannst du dir den Standort einer Haltestelle anzeigen lassen.\n'
            + '• Mit /plan bekommst du den Liniennetzplan als PDF geschickt.\n')
    });
}

function sendMessage(bot, payload, message) {
    if (payload.isInline) {
        const list = [
            {
                id: '0',
                type: 'article',
                title: 'Info',
                message_text: message
            }
        ]
        bot.answerInlineQuery(payload.chatId, list);
    } else {
        bot.sendMessage(payload.chatId, message)
    }
}