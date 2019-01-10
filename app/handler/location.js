const { fetchAllStops } = require('../helper/gtfs')
const { handleMatchingStation } = require('./station')

exports.handleCommandLocation = function (bot, msg) {
  fetchAllStops().then(data => {
    const dataWithDistance = data.map(stop => {
      stop.distance = Math.sqrt(Math.pow((msg.location.latitude - stop.lat) * Math.cos((msg.location.longitude - stop.lon) / 2), 2) + Math.pow(msg.location.longitude - stop.lon, 2)) * 6371
      return stop
    })
    Promise.resolve(dataWithDistance.sort((entry1, entry2) => entry1.distance - entry2.distance))
    const selection = dataWithDistance.slice(0, 5)
    const stationNames = selection.map(station => {
      return [{ text: station.name + ` (${Math.round(station.distance)}m)`, callback_data: station.id }]
    })
    bot.sendMessage(msg.chat.id, 'Danke. Das sind die nächsten 5 Haltestellen:', {
      reply_markup: {
        inline_keyboard: stationNames
      }
    })
    bot.once('callback_query', query => {
      const station = selection.find(station => station.id === query.data)
      bot.answerCallbackQuery(query.id)
      handleMatchingStation(bot, msg, station)
    })
  })
}
