const moment = require('moment')
const createClient = require('hafas-client')
const lvbProfile = require('hafas-client/p/insa')
const client = createClient(lvbProfile, 'fancy-lvbbot')

exports.fetchDeparture = function(bot, msg, stopId) {
  try {
    return client.departures(stopId.split(":")[1], {
      results: 10, duration: 60, language: 'de'
    }).then(retrievedDepartures => {
        const transformed = transformToLvbLayout(retrievedDepartures)
        return transformed
      }
    ).catch(e => {
      bot.sendMessage(msg, 'Fehler beim Abrufen der Abfahrten')
      return Promise.resolve([])
    });
  } catch (error) {
    bot.sendMessage(msg, 'Fehler beim Abrufen der Abfahrten')
    return Promise.resolve([])
  }
}

function transformToLvbLayout(retrievedDepartures) {
  const now = moment().unix() * 1000;
  return retrievedDepartures.filter(dep => {
    const departureTimeInMs = moment(dep.when).unix() * 1000;
    return departureTimeInMs >= now;
  }).map(dep => {
    const timeTableList = [{
      departure: dep.plannedWhen,
      departureDelay: dep.delay && (dep.delay * 1000)
    }];
    return {
      line: getLineDesc(dep),
      timetable: timeTableList
    }
  })
}

function getLineDesc(dep) {
  const lineId = dep.line.name;
  const dest = dep.direction;
  return {
    id: lineId,
    direction: dest
  }
}