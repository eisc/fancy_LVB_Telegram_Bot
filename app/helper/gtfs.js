const fetch = require('node-fetch')
const NodeCache = require('node-cache')
const gtfsCache = new NodeCache();
const stopKey = "stops"

exports.fetchAllStops = function(bot, msg) {
    const stops = gtfsCache.get(stopKey)
    if(stops) {
        return Promise.resolve(stops);
    }
    try {
        return fetch('https://gtfs.leipzig.codefor.de/otp/routers/default/index/stops').then(
            result => {
                const retrievedStops = result.json()
                gtfsCache.set(stopKey, retrievedStops)
                return retrievedStops
            }
        )
    } catch (error) {
        bot.sendMessage(msg, 'Fehler beim Abrufen der Haltestellen')
        return Promise.resolve([])
    }
}