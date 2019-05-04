const gtfsHelper = require('../helper/gtfs')
const stationsHelper = require('../helper/stations')
const departureLvbHelper = require('../helper/departure_lvb')
const departureGtfsHelper = require('../helper/departure_gtfs')
const departureHelper = require('../helper/departure')
const commonStationsHelper = require('../helper/commonstations')

exports.handlePotentialStation = function (bot, msg, match, contextResolver) {
  gtfsHelper.fetchAllStops().then(data => {
    const matchingStations = stationsHelper.getMatchingStations(data, match[0], contextResolver)
    const formattedStations = matchingStations.map(station => {
      station.name = commonStationsHelper.normalizeStationName(station)
      return station
    })
    return Promise.resolve(formattedStations)
  }).then(stations => stationsHelper.handleMatchingStations(bot, msg, stations, match[0], handleMatchingStation))
}

function handleMatchingStation (bot, msg, station) {
  if(station.mappedStations && station.mappedStations.length > 0) {
    handleMultipleMatchingStations(bot, msg, station)
  } else {
    handleSingleMatchingStation(bot, msg, station)
  }
}
exports.handleMatchingStation = handleMatchingStation

function handleSingleMatchingStation (bot, msg, station) {
  if (station.name.includes(' ZUG')) {
    departureGtfsHelper.getDeparturesForStation(bot, msg, station)
  } else {
    departureLvbHelper.getDeparturesForStation(bot, msg, station);
  }
}

function handleMultipleMatchingStations (bot, msg, station) {
  const calls = collectDepartureCalls(bot, msg, station.mappedStations)
  Promise.all(calls).then(departureLists => {
    const departures = flatMapDepartureLists (departureLists)
    departureHelper.handleDeparture(bot, msg, station, departures)
  }).catch(function(error) { 
    bot.sendMessage(msg.chat.id, 'Fehler ' + error.message)
  })
}

function collectDepartureCalls (bot, msg, stations) {
  const calls = []
  stations.forEach(station => {
    if (station.name.includes(' ZUG')) {
      calls.push(departureGtfsHelper.getDeparturesForStationPromise(bot, msg, station)
        .catch(() => []))
    } else {
      calls.push(departureLvbHelper.getDeparturesForStationPromise(station)
        .catch(() => []))
    }
  })
  return calls
}

function flatMapDepartureLists (departureLists) {
  const departures = []
  departureLists.forEach(departureList => {
    departureList.forEach(departure => {
      if (!departures.includes(departure)) {
        departures.push(departure)
      }
    })
  })
  return departures
}