let globalStations = []

exports.getGlobalStations = function () {
    return globalStations;
}

exports.addGlobalStation = function (name) {
    if(globalStations.indexOf(name) === -1) {
        globalStations.push(name)
    }
}

exports.removeFromGlobalStations = function(station) {
    if(globalStations.indexOf(station) !== -1) {
        globalStations.splice(globalStations.indexOf(station), 1)
    }
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