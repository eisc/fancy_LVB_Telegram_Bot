const TelegramBot = require('node-telegram-bot-api')
const { TELEGRAM_TOKEN } = require('../../config/config')

// Create a bot that uses 'polling' to fetch new updates
exports.createBot = function () {
    return new TelegramBot(TELEGRAM_TOKEN, { polling: true })
}