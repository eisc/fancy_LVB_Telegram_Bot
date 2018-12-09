process.env['NTBA_FIX_319'] = 1

const { handleCommandStart, handleCommandHelp } = require('./handler/general')
const { handleCommandPlan } = require('./handler/plan')
const { handleCommandAdd } = require('./handler/stationadd')
const { handleCommandReset } = require('./handler/reset')
const { handleCommandLocation } = require('./handler/location')
const { handleCommandStation } = require('./handler/station')
const { handleCommandDeparture } = require('./handler/departure')

const bot = require('./helper/bot').createBot()

bot.onText(/\/start/, (msg) => handleCommandStart(bot, msg))
bot.onText(/\/help/, (msg) => handleCommandHelp(bot, msg))
bot.onText(/\/plan(\s*)(.*)/, (msg, match) => handleCommandPlan(bot, msg, match))
bot.onText(/\/add(\s*)(.*)/, (msg, match) => handleCommandAdd(bot, msg, match))
bot.onText(/\/reset(\s*)(.*)/, (msg, match) => handleCommandReset(bot, msg, match))
bot.on('location', (msg) => handleCommandLocation(bot, msg))
bot.onText(/\/station(\s*)(.*)/, (msg, match) => handleCommandStation(bot, msg, match))
bot.onText(/\/departure(\s*)(.*)/, (msg, match) => handleCommandDeparture(bot, msg, match))