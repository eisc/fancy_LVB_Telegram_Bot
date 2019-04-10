const TelegramBot = require('node-telegram-bot-api')
const telegramToken = getTelegramToken('TELEGRAM_TOKEN', '../../config/config')

// Create a bot that uses 'polling' to fetch new updates
exports.createBot = function () {
  return createBotWithArgs({ telegramToken, options: { polling: true } })
}

function createBotWithArgs (args) {
  const { telegramToken, options } = args
  return new TelegramBot(telegramToken, options)
}

function getTelegramToken (envParam, file) {
  try {
    return process.env[envParam] || require(file).TELEGRAM_TOKEN
  } catch (error) {
    return 'dummyToken'
  }
}
