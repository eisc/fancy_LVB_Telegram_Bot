const { fetchAllStops } = require('../helper/gtfs')
const { getMatchingStations, handleMatchingStations } = require('../helper/stations')
const { getDeparturesForStation } = require('../helper/departure')

exports.handlePotentialStation = function (bot, msg, match) {
    fetchAllStops().then(data => {
        const matchingStations = getMatchingStations(data, match)
        return Promise.resolve(matchingStations)
    }).then(stations => handleMatchingStations(bot, msg, stations, match, handleMatchingStation))
}

 exports.handleMatchingStation = function (bot, msg, station) {
    bot.sendMessage(msg.chat.id, `Das sind die nächsten Abfahrten für ${station.name}:`)
    getDeparturesForStation(bot, msg, station);
}
