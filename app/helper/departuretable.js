const table = require('text-table')
const sortHelper = require('./departuresort')
const calcHelper = require('./departurecalc')

exports.createAnswerForDepartureResult = function (departureResults) {
  var departure = []
  if (departureResults.length === 0) {
    return departure
  }
  departureResults.forEach(res => {
    if (res.timetable && res.timetable.length > 0) {
      res.timetable.forEach(time => {
        departure.push([
          res.line.id,
          res.line.direction,
          formattedDepartureMinutesFromNow(time),
          formattedDelayMinutes(time)
        ])
      })
    }
  })
  departure.sort((entry1, entry2) => sortHelper.compareDepartureEntries(entry1, entry2))
  return departure
}

function formattedDepartureMinutesFromNow (time) {
  const departureInMinutes = calcHelper.calcDepartureMinutesFromNow(time)
  return departureInMinutes === 0
    ? ''
    : departureInMinutes
}

function formattedDelayMinutes (time) {
  const delayMinutes = calcHelper.calcDelayInMinutes(time)
  if (delayMinutes === 0) {
    return ''
  }
  const sign = delayMinutes > 0
    ? '+'
    : ''
  return ` ${sign}${delayMinutes}`
}

exports.departureTable = function (station, answer) {
  return `Abfahrten für *${station.name}*\n${'`'}${answerToTable(answer)}${'`'}`
}

function answerToTable (answer) {
  const style = {
    align: ['r',
      'l',
      'r']
  }
  return table(answer, style)
}
