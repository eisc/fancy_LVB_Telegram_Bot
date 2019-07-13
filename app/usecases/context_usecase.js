const { CONTEXT_SET } = require('../events/events')

const extraLeipzigAreaStations = [
    'Markkleeberg, Forsthaus Raschwitz',
    'Gundorf, Friedhof',
    'Taucha (b. Leipzig), Am Obstgut',
    'Markkleeberg, Cospudener See/Erlebnisachse',
    'Markkleeberg, Cospudener See/Nordstrand',
    'Zum Dölitzer Schacht'
]
var currentContext = 'MDV'

exports.registerListener = function (eventbus, bot) {
    eventbus.on(CONTEXT_SET.eventType, (payload) => {
        var message;
        if (payload.context === '') {
            message = 'Bitte gib einen Stadtnamen (oder "MDV" für alle) ein.';
        } else if (payload.context === 'MDV' || payload.context === 'Leipzig') {
            message = `"${payload.context}" erfolgreich als context gesetzt`;
        } else {
            message = 'Nur "MDV" und "Leipzig" sind derzeit als context erlaubt';
        }
        if (payload.isInline) {
            const list = [
                {
                    id: '0',
                    type: 'article',
                    title: 'Kontext',
                    message_text: 'Kontext-Setzen wird im Inline-Mode nicht unterstützt'
                }
            ]
            bot.answerInlineQuery(payload.chatId, list);
        } else {
            bot.sendMessage(payload.chatId, message)
        }
    });
}

exports.isInCurrentContext = function (station) {
    if (currentContext === 'MDV') {
        return true
    } else if (currentContext === 'Leipzig' &&
        (station.name.startsWith('Leipzig,') ||
            station.name.startsWith('Leipzig-') ||
            station.name.startsWith('Leipzig ') ||
            extraLeipzigAreaStations.indexOf(station.name) !== -1
        )) {
        return true
    }
    return false
}