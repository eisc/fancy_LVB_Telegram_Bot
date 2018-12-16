const { fetchAllStops } = require('../helper/gtfs')
const { getMatchingStations, handleMatchingStations } = require('../helper/stations')
const { getDeparturesForStation } = require('../helper/departure')

exports.handlePotentialStation = function (bot, msg, match) {
    if (match[0] === '') {
        bot.sendMessage(msg.chat.id, 'Bitte gib eine Haltestelle ein.')
        return
    }
    fetchAllStops().then(data => {
        const matchingStations = getMatchingStations(data, match[0])
        return Promise.resolve(matchingStations)
    }).then(stations => handleMatchingStations(bot, msg, stations, match[0], handleMatchingStation))
}

function handleMatchingStation(bot, msg, station) {
    bot.sendMessage(msg.chat.id, `Das sind die nächsten Abfahrten für ${station.name}:`)
    getDeparturesForStation(bot, msg, station);
}