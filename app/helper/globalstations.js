let globalStations = []

exports.getGlobalStations = function () {
    return globalStations;
}

exports.addGlobalStation = function (name) {
    globalStations.push(name)
}

exports.deleteGlobalStations = function () {
    globalStations.length = 0
}