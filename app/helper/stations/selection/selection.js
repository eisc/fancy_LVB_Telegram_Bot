exports.getMessageForMatchingStations = function (stations, station) {
    if (tooManyStationsFound(stations)) {
        return 'Es gibt zu viele Treffer, bitte gib was genaueres ein.'
    } else if (noStationsFound(stations)) {
        return `${station} ist keine Haltestelle, versuch es nochmal. \u{1F643}`
    } else {
        return null
    }
}

function noStationsFound(stations) {
    return stations.length === 0;
}

function tooManyStationsFound(stations) {
    return stations.length >= 11;
}