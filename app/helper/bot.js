const TelegramBot = require('node-telegram-bot-api')
const config = require('../../config/config')

// Create a bot that uses 'polling' to fetch new updates
exports.createBot = function () {
    const token = config.TELEGRAM_TOKEN
    return new TelegramBot(token, { polling: true })
}