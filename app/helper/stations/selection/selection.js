exports.getMessageForMatchingStations = function (stations, requestString) {
    if (tooManyStationsFound(stations)) {
        return 'Es gibt zu viele Treffer, bitte gib was genaueres ein.'
    } else if (noStationsFound(stations)) {
        return `${requestString} ist keine Haltestelle, versuch es nochmal. \u{1F643}`
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