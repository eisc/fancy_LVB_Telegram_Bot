let globalStations = []

exports.getGlobalStations = function () {
    return globalStations;
}

exports.addGlobalStation = function (name) {
    globalStations.push(name)
}

exports.removeFromGlobalStation = function(station) {
    globalStations.splice(globalStations.indexOf(station), 1)
}

exports.deleteGlobalStations = function () {
    globalStations.length = 0
}

exports.globalStationsAsKeyboard = function () {
    return {
        reply_markup: {
            keyboard: [globalStations],
            resize_keyboard: true
        }
    }
}