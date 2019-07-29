const selectable = require('./selection/selectable')
const globalStations = []

exports.globalStationsLength = function () {
  return globalStations.length
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

exports.removeFromGlobalStations = function (station) {
  globalStations.splice(globalStations.indexOf(station), 1)
}

function deleteGlobalStations() {
  globalStations.length = 0
}
exports.deleteGlobalStations = deleteGlobalStations

function removeKeyboard() {
  return {
    reply_markup: {
      remove_keyboard: true
    }
  }
}
exports.removeKeyboard = removeKeyboard

exports.globalStationsAsKeyboard = function () {
  return {
    reply_markup: {
      keyboard: selectable.transformToSelectableStationNames(globalStations),
      resize_keyboard: true
    }
  }
}
