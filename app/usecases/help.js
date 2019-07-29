const commandRegex = /\/help/

function registerListener (bot) {
    bot.onText(commandRegex, msg => handleCommandHelp (bot, msg.chat.id))
}

function handleCommandHelp (bot, chatId) {
    bot.sendMessage(chatId, getHelpMessage())
}

function getHelpMessage() {
    return 'Hier eine Übersicht über alle Funkionen:'
        + '\n\n• Tippe einfach einen Haltestellennamen oder einen Teil davon ein um die'
        + 'Abfahrten dort angezeigt zu bekommen.\n'
        + '• Mit /add kannst du eine Kurzwahlliste erstellen.\n'
        + '• Mit /reset kannst du die Kurzwahlliste löschen. Gibst du den Namen einer '
        + 'Haltestelle ein, dann löscht es nur diese aus der Liste.\n'
        + '• Sende mir deinen Standort ich zeige dir die 5 nächstgelegenen Haltestellen.\n'
        + '• Mit /station kannst du dir den Standort einer Haltestelle anzeigen lassen.\n'
        + '• Mit /plan bekommst du den Liniennetzplan als PDF geschickt.\n'
}

function handleInline (bot, chatId) {
    const list = [
        {
            id: '0',
            type: 'article',
            title: 'Info',
            message_text: getHelpMessage()
        }
    ]
    bot.answerInlineQuery(chatId, list);
}

module.exports = Object.freeze({
    commandRegex,
    registerListener,
    handleInline
});