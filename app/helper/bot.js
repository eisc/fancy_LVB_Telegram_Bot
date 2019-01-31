const TelegramBot = require('node-telegram-bot-api')
const telegramToken = getTelegramToken('TELEGRAM_TOKEN', '../../config/config')

// Create a bot that uses 'polling' to fetch new updates
exports.createBot = function () {
    return new TelegramBot(telegramToken, { polling: true })
}

function getTelegramToken(envParam, file) {
    try {
        return process.env[envParam] || require(file).TELEGRAM_TOKEN;
    } catch (error) {
        return 'dummyToken'
    }
}