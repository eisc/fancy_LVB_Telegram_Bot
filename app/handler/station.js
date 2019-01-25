const gtfsHelper = require('../helper/gtfs')
const stationsHelper = require('../helper/stations')
const departureHelper = require('../helper/departure_lvb')

exports.handlePotentialStation = function (bot, msg, match) {
    gtfsHelper.fetchAllStops().then(data => {
        const matchingStations = stationsHelper.getMatchingStations(data, match[0])
        return Promise.resolve(matchingStations)
    }).then(stations => stationsHelper.handleMatchingStations(bot, msg, stations, match[0], handleMatchingStation))
}

function handleMatchingStation (bot, msg, station) {
    departureHelper.getDeparturesForStation(bot, msg, station);
}
exports.handleMatchingStation = handleMatchingStation;
