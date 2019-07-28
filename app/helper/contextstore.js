const extraLeipzigAreaStations = [
    'Markkleeberg, Forsthaus Raschwitz',
    'Gundorf, Friedhof',
    'Taucha (b. Leipzig), Am Obstgut',
    'Markkleeberg, Cospudener See/Erlebnisachse',
    'Markkleeberg, Cospudener See/Nordstrand',
    'Zum Dölitzer Schacht'
]
var currentContext = 'MDV'

exports.setContext = function(context) {
    if (context === 'MDV') {
        currentContext = null
    } else if (context === 'Leipzig') {
        currentContext = context
    }
}

exports.isInCurrentContext = function (station) {
    if (currentContext === 'MDV') {
        return true
    } else if (currentContext === 'Leipzig' &&
        (station.name.startsWith('Leipzig,') ||
            station.name.startsWith('Leipzig-') ||
            station.name.startsWith('Leipzig ') ||
            extraLeipzigAreaStations.indexOf(station.name) !== -1
        )) {
        return true
    }
    return false
}