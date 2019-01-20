const commonStationHelper = require('./commonstations')
const globalStations = []

exports.isEmpty = function () {
    return globalStations.length === 0;
}

exports.getMatchingGlobalStations = function (stationName) {
    return commonStationHelper.getMatchingStations(globalStations, stationName)
}

exports.addGlobalStation = function (station) {
    if(!containedInGlobalStations(station)) {
        globalStations.push(station)
    }
}

function getGlobalStationIds() {
    return globalStations.map(globalStation => globalStation.id)
}

function containedInGlobalStations(station) {
    return getGlobalStationIds().indexOf(station.id) !== -1
}
exports.containedInGlobalStations = containedInGlobalStations;

exports.removeFromGlobalStations = function(station) {
    if(containedInGlobalStations(station)) {
        if(globalStations.length === 1) {
            globalStations.length = 0
        } else {
            globalStations.splice(globalStations.indexOf(station), 1)
        }
    }
}

exports.deleteGlobalStations = function () {
    globalStations.length = 0
}

exports.globalStationsAsKeyboard = function () {
    return {
        reply_markup: {
            keyboard: commonStationHelper.transformToSelectableStationNames(globalStations),
            resize_keyboard: true
        }
    }
}