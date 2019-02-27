const lvb = require('lvb')
const stationsHelper = require('../helper/stations')
const departureHelper = require('../helper/departure_lvb')
const commonStationsHelper = require('../helper/commonstations')

exports.handlePotentialStation = function (bot, msg, match) {
  lvb.stations(match[0]).then(stations => {
    const formattedStations = stations.map(station => {
      station.name = commonStationsHelper.normalizeStationName(station)
      return station
    })
    return Promise.resolve(formattedStations)
  }).then(stations => stationsHelper.handleMatchingStations(bot, msg, stations, match[0], handleMatchingStation))
}

function handleMatchingStation (bot, msg, station) {
  departureHelper.getDeparturesForStation(bot, msg, station);
}
exports.handleMatchingStation = handleMatchingStation;
