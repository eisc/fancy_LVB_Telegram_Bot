const gtfsHelper = require('../helper/gtfs')
const stationsHelper = require('../helper/stations')
const globalStationsHelper = require('../helper/globalstations')
const commonStationsHelper = require('../helper/commonstations')

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
  gtfsHelper.fetchAllStops().then(data => {
    const matchingStations = stationsHelper.getMatchingStations(data, match[2], currentContextFun)
    const formattedStations = matchingStations.map(station => {
      station.name = commonStationsHelper.normalizeStationName(station)
      return station
    })
    return Promise.resolve(formattedStations)
  }).then(stations => stationsHelper.handleMatchingStations(bot, msg, stations, match[0], handleMatchingStation))
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
