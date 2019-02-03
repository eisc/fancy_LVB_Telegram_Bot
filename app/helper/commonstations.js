exports.normalizeStationId = function (stationId) {
  if (stationId.startsWith('1:')) {
    return stationId.substring(4)
  }
  return stationId
}

exports.getMatchingStations = function (stations, charSequence) {
  return stations.filter(stop => stationIncludesStringInName(stop, charSequence))
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