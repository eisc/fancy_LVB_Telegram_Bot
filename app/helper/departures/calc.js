const moment = require('moment')
var fixedDate = null

exports.calcDepartureMinutesFromNow = function(time) {
  const depTime = new Date(Date.parse(time.departure))
  const diffToNow = moment(depTime).diff(referenceTime())
  const diffInMinutes = moment.duration(diffToNow).as('minutes')
  return Math.floor(diffInMinutes)
}

function referenceTime() {
  return fixedDate
    ? fixedDate
    : moment();
}

exports.calcDelayInMinutes = function(time) {
  return Math.floor(time.departureDelay / 60000);
}