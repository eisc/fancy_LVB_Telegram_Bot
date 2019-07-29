const commandRegex = /\/start/

function registerListener (bot) {
    bot.onText(commandRegex, msg => handleCommandStart (bot, msg))
}

function handleCommandStart (bot, msg) {
    bot.sendMessage(msg.chat.id, getStartMessage(msg.from.first_name))
}

function getStartMessage(firstName) {
    return 'Hallo ' + firstName
        + '!\nIch helfe dir gerne bei den Abfahrtszeiten von Bussen und Bahnen der LVB.'
        + '\nBei /help werden dir alle Funktionen dieses Bots aufgelistet.'
}

function handleInline (bot, chatId) {
    const list = [
        {
            id: '0',
            type: 'article',
            title: 'Info',
            message_text: getStartMessage('Du')
        }
    ]
    bot.answerInlineQuery(chatId, list);
}

module.exports = Object.freeze({
    commandRegex,
    registerListener,
    handleInline
});