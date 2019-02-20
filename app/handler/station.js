const gtfsHelper = require('../helper/gtfs')
const stationsHelper = require('../helper/stations')
const departureHelper = require('../helper/departure_lvb')
const commonStationsHelper = require('../helper/commonstations')

exports.handlePotentialStation = function (bot, msg, match, contextResolver) {
  gtfsHelper.fetchAllStops().then(data => {
    const matchingStations = stationsHelper.getMatchingStations(data, match[0], contextResolver)
    const formattedStations = matchingStations.map(station => {
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
