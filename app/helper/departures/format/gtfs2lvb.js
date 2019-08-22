const moment = require('moment');

exports.transformToLvbLayout = function (retrievedDepartures) {
  return retrievedDepartures.map(dep => {
    const timeTableList = []
    const today = moment().startOf('day')
    const now = moment()
    for (var timeIndex = 0; timeIndex < dep.times.length; timeIndex += 1) {
      const time = dep.times[timeIndex]
      const relativeDepartureInMs = parseInt(time.scheduledDeparture, 10) * 1000
      const departureTimeInMs = today + relativeDepartureInMs
      if(departureTimeInMs >= now) {
        timeTableList.push({
          departure: moment(departureTimeInMs).local().toISOString(),
          departureDelay: 0
        })
      }
    }
    return {
      line: getLineDesc(dep),
      timetable: timeTableList
    }
  })
}

function getLineDesc(dep) {
  const toStr = ' to '
  const idIndex = dep.pattern.desc.indexOf(toStr)
  const lineId = dep.pattern.desc.substring(0, idIndex)
  const destIndex = dep.pattern.desc.substring(idIndex).indexOf(' (')
  const dest = dep.pattern.desc.substring(idIndex + toStr.length, idIndex + destIndex);
  return {
    id: lineId,
    direction: dest
  }
}