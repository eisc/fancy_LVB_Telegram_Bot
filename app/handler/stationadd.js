const lvb = require('lvb')
const stationsHelper = require('../helper/stations')
const globalStationsHelper = require('../helper/globalstations')

function defaultContextFun() { 
  return true 
}
var currentContextFun = defaultContextFun

exports.handleCommandAdd = function (bot, msg, match, isInCurrentContext) {
  if (match[2] === '') {
    bot.sendMessage(msg.chat.id, 'Bitte gib eine Haltestelle ein.')
    return
  }
  currentContextFun = isInCurrentContext
  lvb.stations(match[2]).then(stations => stationsHelper.handleMatchingStations(bot, msg, stations, match[2], handleMatchingStation))
}

function handleMatchingStation(bot, msg, station) {
  if (globalStationsHelper.containedInGlobalStations(station)) {
    bot.sendMessage(msg.chat.id, `${station.name} steht bereits auf der Liste.`);
  } else if (currentContextFun(station)) {
    globalStationsHelper.addGlobalStation(station);
    bot.sendMessage(msg.chat.id, `${station.name} wurde hinzugefügt.`,
    globalStationsHelper.globalStationsAsKeyboard())
  } else {
    bot.sendMessage(msg.chat.id, `${station.name} passt nicht zum aktuell gesetzten Context.`);
  }
}
