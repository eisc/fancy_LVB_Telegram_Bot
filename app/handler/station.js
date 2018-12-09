const { fetchAllStops } = require('../helper/gtfs')
const { getMatchingStations, handleMatchingStations } = require('../helper/stations')

exports.handleCommandStation = function (bot, msg, match) {
    if (match[2] === '') {
        bot.sendMessage(msg.chat.id, 'Bitte gib eine Haltestelle ein.')
        return
    }
    console.log("before fetch")
    fetchAllStops().then(data => {
        const matchingStations = getMatchingStations(data, match[2])
        return Promise.resolve(matchingStations)
    }).then(stations => handleMatchingStations(bot, msg, stations, match[2], handleMatchingStation))
}

function handleMatchingStation(bot, msg, station) {
    bot.sendMessage(msg.chat.id,
        `Das sind die nächsten 10 Abfahrten für ${station.name}:`)

}