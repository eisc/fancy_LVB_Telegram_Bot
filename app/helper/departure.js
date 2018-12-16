const moment = require('moment')
const { departures, stations } = require('lvb')

exports.getDeparturesForStation = function (bot, msg, station) {
    normalizeStationId(station)
    departures(station.id, new Date()).then(
        departure => handleDeparture(bot, msg, station, departure)
    ).catch(error => {
        bot.sendMessage(msg.chat.id, 'Fehler ' + error)
    })
}

function normalizeStationId(station) {
    station.id = station.id.substring(4)
}

function handleDeparture(bot, msg, station, departureResults) {
    if (departureResults.length) {
        departureResults.forEach(res => {
            if (res.line) {
                var answer = `Abfahrt ab ${station.name} von ${res.line.name} in Richtung ${res.line.direction}`
                if (res.timetable) {
                    answer += '\n'
                    res.timetable.forEach(time => {
                        answer += handleDepartureTime(time)
                    })
                } else {
                    answer += '- Keine Abfahrtszeiten verfügbar für ' + station.name
                }
                bot.sendMessage(msg.chat.id, answer)
            } else {
                bot.sendMessage(msg.chat.id, 'Keine Linieninformationen verfügbar')
            }
        })
    } else {
        bot.sendMessage(msg.chat.id, 'Keine aktuellen Abfahrten gefunden für ' + station.name)
    }
}

function handleDepartureTime(time) {
    const depTime = new Date(Date.parse(time.departure))
    const departureStr = moment(depTime).format('HH:mm:ss')
    var answer = `- um ${departureStr}`
    if (time.departureDelay !== 0) {
        const delay = new Date(time.departureDelay)
        const delayStr = moment(delay).format('mm:ss')
        answer += ` mit einer Verspätung von ${delayStr} Minuten`
    }
    answer += '\n'
    return answer
}