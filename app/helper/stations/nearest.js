exports.getNearestStationsForSelection = function (allStops, location, maxNearest) {
  const dataWithDistance = allStops.map(stop => {
    stop.distance = Math.sqrt(Math.pow((location.longitude - stop.lon) * Math.cos((location.latitude + stop.lat) / 2), 2) + Math.pow(msg.location.latitude - stop.lat, 2)) * 63710
    return stop
  }).sort((entry1, entry2) => entry1.distance - entry2.distance)
  const upperBound = maxNearest < dataWithDistance.length ? maxNearest : dataWithDistance.length - 1
  const selection = dataWithDistance.slice(0, upperBound)
  return selection.map(station => {
    return [{ text: station.name + ` (${Math.round(station.distance)}m)`, callback_data: station.id }]
  })
}
