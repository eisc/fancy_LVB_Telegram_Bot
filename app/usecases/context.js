const contextstore = require('../helper/contextstore')

exports.commandRegex = /\/context(\s*)(.*)/

exports.registerListener = function (bot) {
    bot.onText(commandRegex, (msg, match) => handleContext (bot, msg.chat.id, match[2]))
}

exports.isInCurrentContext = function (station) {
    return contextstore.isInCurrentContext(station)
}

function handleContext (bot, chatId, context) {
    contextstore.setContext(context)
    const answer = getAnswer(context)
    bot.sendMessage(chatId, answer)
}

function getAnswer(context) {
    if (context === '') {
        return 'Bitte gib einen Stadtnamen (oder "MDV" für alle) ein.'
    } else if (context === 'MDV') {
        return '"MDV" erfolgreich als context gesetzt'
    } else if (context === 'Leipzig') {
        return '"Leipzig" erfolgreich als context gesetzt, reset mit /context MDV jederzeit möglich'
    } else {
        return 'Nur "MDV" und "Leipzig" sind derzeit als context erlaubt'
    }
}

exports.handleInline = function (bot, chatId) {
    const list = [
        {
            id: '0',
            type: 'article',
            title: 'Kontext',
            message_text: 'Kontext-Setzen wird im Inline-Mode nicht unterstützt'
        }
    ]
    bot.answerInlineQuery(chatId, list);
}