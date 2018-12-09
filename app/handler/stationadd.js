const { fetchAllStops } = require('../helper/gtfs')
const { getMatchingStations, handleMatchingStations } = require('../helper/stations')
const { getGlobalStations, globalStationsAsKeyboard, addGlobalStation }
  = require('../helper/globalstations')

exports.handleCommandAdd = function (bot, msg, match) {
  if (match[2] === '') {
    bot.sendMessage(msg.chat.id, 'Bitte gib eine Haltestelle ein.')
    return
  }
  fetchAllStops().then(data => {
    const matchingStations = getMatchingStations(data, match[2])
    return Promise.resolve(matchingStations)
  }).then(stations => handleMatchingStations(bot, msg, stations, match[2], handleMatchingStation))
}

function handleMatchingStation(bot, msg, station) {
  if (getGlobalStations().includes(station.name)) {
    bot.sendMessage(msg.chat.id, `${station.name} steht bereits auf der Liste.`);
  } else {
    addGlobalStation(station.name);
    bot.sendMessage(msg.chat.id, `${station.name} wurde hinzugefügt.`,
      globalStationsAsKeyboard())
  }
}
