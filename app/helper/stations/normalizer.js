exports.normalizeStationId = function (stationId) {
  if (stationId.startsWith('1:')) {
    return stationId.substring(4)
  }
  return stationId
}

exports.normalizeStationName = function (station) {
  if (station.name.startsWith('Leipzig,')) {
    return station.name.substring(9)
  } else if (station.name.startsWith('Leipzig-')
      || station.name.startsWith('Leipzig ')) {
    return station.name.substring(8)
  }
  return station.name
}