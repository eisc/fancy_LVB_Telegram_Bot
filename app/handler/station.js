const lvb = require('lvb')
const stationsHelper = require('../helper/stations')
const departureHelper = require('../helper/departure_lvb')

exports.handlePotentialStation = function (bot, msg, match) {
  lvb.stations(match[0]).then(stations => stationsHelper.handleMatchingStations(bot, msg, stations, match[0], handleMatchingStation))
}

function handleMatchingStation (bot, msg, station) {
  departureHelper.getDeparturesForStation(bot, msg, station);
}
exports.handleMatchingStation = handleMatchingStation;
