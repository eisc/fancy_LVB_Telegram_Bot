process.env['NTBA_FIX_319'] = 1

const { handleCommandStart, handleCommandHelp } = require('./handler/general')
const { handleContext, isInCurrentContext } = require('./handler/context')
const { handleCommandPlan } = require('./handler/plan')
const { handleCommandAdd } = require('./handler/stationadd')
const { handleCommandReset } = require('./handler/reset')
const { handleCommandLocation } = require('./handler/location')
const { handlePotentialStation } = require('./handler/station')

const bot = require('./helper/bot').createBot()

bot.onText(/\/context(\s*)(.*)/, (msg, match) => handleContext(bot, msg, match))
bot.onText(/\/start/, (msg) => handleCommandStart(bot, msg))
bot.onText(/\/help/, (msg) => handleCommandHelp(bot, msg))
bot.onText(/\/plan/, (msg, match) => handleCommandPlan(bot, msg, match))
bot.onText(/\/add(\s*)(.*)/, (msg, match) => handleCommandAdd(bot, msg, match, isInCurrentContext))
bot.onText(/\/reset(\s*)(.*)/, (msg, match) => handleCommandReset(bot, msg, match))
bot.on('location', (msg) => handleCommandLocation(bot, msg))

const noKeyword = /^((?!(\/start|\/help|\/plan|\/add|\/context|\/reset)).)*$/
bot.onText(noKeyword, (msg, match) => handlePotentialStation(bot, msg, match, isInCurrentContext));
