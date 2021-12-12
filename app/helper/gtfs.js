const fetch = require('node-fetch')
const NodeCache = require('node-cache')
const gtfsCache = new NodeCache();
const stopKey = "stops"
const moment = require('moment')

exports.fetchAllStops = function(bot, msg) {
  const stops = gtfsCache.get(stopKey)
  if(stops) {
    return Promise.resolve(stops);
  }
  try {
    return fetch('https://gtfs.codeforleipzig.de/otp/routers/default/index/stops').then(
      result => {
        const retrievedStops = result.json()
        gtfsCache.set(stopKey, retrievedStops)
        return retrievedStops
      }
    )
  } catch (error) {
    bot.sendMessage(msg, 'Fehler beim Abrufen der Haltestellen')
    return Promise.resolve([])
  }
}

exports.fetchDeparture = function(bot, msg, stopId) {
  try {
    const now = moment().format('YYYYMMDD')
    return fetch(`https://gtfs.codeforleipzig.de/otp/routers/default/index/stops/${stopId}/stoptimes/${now}`).then(response => {
      return response.text()
    }).then(result => {
        const retrievedDepartures = JSON.parse(result)
        const transformed = transformToLvbLayout(retrievedDepartures)
        return transformed
      }
    )
  } catch (error) {
    bot.sendMessage(msg, 'Fehler beim Abrufen der Abfahrten')
    return Promise.resolve([])
  }
}

function transformToLvbLayout(retrievedDepartures) {
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