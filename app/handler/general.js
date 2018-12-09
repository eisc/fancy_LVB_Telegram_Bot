exports.handleCommandStart = function (bot, msg) {
    bot.sendMessage(msg.chat.id, 'Hallo ' + msg.from.first_name
        + '!\nIch helfe dir gerne bei den Abfahrtszeiten von Bussen und Bahnen der LVB.'
        + '\nBei /help werden dir alle Funktionen dieses Bots aufgelistet.')
}

exports.handleCommandHelp = function (bot, msg) {
    bot.sendMessage(msg.chat.id, 'Hier eine Übersicht über alle Funkionen:'
        + '\n\n• Mit /plan bekommst du den Liniennetzplan als PDF geschickt.\n'
        + '• Mit /add kannst du eine Kurzwahlliste erstellen. Gib dazu einfach '
        + 'ein Namen einer Haltestelle ein.\n• Mit /reset kannst du die Kurzwahlliste '
        + 'komplett löschen. Gibst du den Namen einer Haltestelle ein, dann löscht es '
        + 'nur diese aus der Liste.\n• Mit /onlocation kannst du mir deinen Standort '
        + 'senden und dir die 5 nächstgelegenen Haltestellen anzeigen lassen.\n'
        + '• Bei /station wird dir der Standort einer Haltestelle angezeigt.')
}
