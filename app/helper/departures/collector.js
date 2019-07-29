const lvbDeparure = require('./fetcher/lvb')
const gtfsDeparture = require('./fetcher/gtfs')

async function collectDepartures (station) {
    if (station.mappedStations && station.mappedStations.length > 0) {
        return await collectDeparturesForMultipleStations(station)
    } else {
        return await collectDeparturesForStation(station)
    }
}
exports.collectDepartures = collectDepartures

async function collectDeparturesForMultipleStations(station) {
    const departureLists = await collectDeparturesForStations(station.mappedStations)
    return flatMapDepartureLists(departureLists)
}

async function collectDeparturesForStation(station) {
    if (station.name.includes(' ZUG')) {
        return await gtfsDeparture.getGtfsDeparturesForStation(station)
    } else {
        return await lvbDeparure.getLvbDeparturesForStation(station);
    }
}

async function collectDeparturesForStations(stations) {
    const departures = []
    for(index = 0; index < stations.length; index++) {
        station = stations[index]
        var foundDepartures = await collectDeparturesForStation(station);
        departures.push(foundDepartures);
    }
    return departures
}

function flatMapDepartureLists(departureLists) {
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
