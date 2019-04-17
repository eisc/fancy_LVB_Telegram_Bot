const stationsHelper = require('../helper/stations')
const departureLvbHelper = require('../helper/departure_lvb')
const departureGtfsHelper = require('../helper/departure_gtfs')

exports.handlePotentialStation = function (bot, msg, match, contextResolver) {
  stationsHelper.getAllStations(bot, msg, match, contextResolver)
    .then(stations => {
      return stationsHelper.handleMatchingStations(bot, msg, stations, match[0], handleMatchingStation)
    })
}

function handleMatchingStation (bot, msg, station) {
  if (station.name.includes(' ZUG')) {
    departureGtfsHelper.getDeparturesForStation(bot, msg, station)
  } else {
    departureLvbHelper.getDeparturesForStation(bot, msg, station)
  }
}
exports.handleMatchingStation = handleMatchingStation
