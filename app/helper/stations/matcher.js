const merger = require('./merger')

exports.getMatchingStations = function (stations, charSequence, contextResolver) {
  return withCompositeStations(stations)
    .filter(stop => stationIncludesStringInName(stop, charSequence))
    .filter(stop => contextResolver(stop))
}

function withCompositeStations(stations) {
  const allStations = []
  stations.forEach(st => allStations.push(st))
  merger.getCompositeStations().forEach(st => allStations.push(st))
  return removeDuplicateStations(allStations)
}

function removeDuplicateStations(stations) {
  const allStations = []
  const allMappedStations = []
  stations.forEach(station => {
    if(station.mappedStations && station.mappedStations.length > 0) {
      station.mappedStations.forEach(ms => {
        if (!allMappedStations.includes(ms.id)) {
          allMappedStations.push(ms.id)
        }
      })
    }
  })
  stations.forEach(station => {
    if ((station.mappedStations && station.mappedStations.length > 0)
        || !allMappedStations.includes(station.id)) {
      allStations.push(station)
    }
  })
  return allStations
}

function stationIncludesStringInName (station, charSequence) {
  return station.name.toLowerCase().includes(charSequence.toLowerCase())
}