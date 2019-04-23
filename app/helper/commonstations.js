const stationMerger = require('./station_merger')

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

exports.getMatchingStations = function (stations, charSequence, contextResolver) {
  return withCompositeStations(stations)
    .filter(stop => stationIncludesStringInName(stop, charSequence))
    .filter(stop => contextResolver(stop))
}

function withCompositeStations(stations) {
  const allStations = []
  stations.forEach(st => allStations.push(st))
  stationMerger.getCompositeStations().forEach(st => allStations.push(st))
  return allStations
}

function stationIncludesStringInName (station, charSequence) {
  return station.name.toLowerCase().includes(charSequence.toLowerCase())
}

exports.transformToSelectableStationNames = function (stations) {
  if(stations.length === 0) {
    return [[]]
  }
  return stations.map(station => {
    return [{ text: station.name, callback_data: station.id }];
  });
}
