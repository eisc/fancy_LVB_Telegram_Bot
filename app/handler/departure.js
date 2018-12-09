const moment = require('moment')
const stations = require('lvb').stations
const departures = require('lvb').departures

exports.handleCommandDeparture = function (bot, msg, match) {
    if (match[2] === '') {
        bot.sendMessage(msg.chat.id, 'Bitte gib eine Haltestelle ein.')
        return
    }
    const stopName = match[2]
    try {
        stations(stopName).then(stations => {
            if (stations.length) {
                stations.forEach(station => handleStation(bot, msg, station))
            } else {
                bot.sendMessage(msg.chat.id, 'Keine Station gefunden für ' + stopName)
            }
        }).catch(error => {
            bot.sendMessage(msg.chat.id, 'Fehler ' + error)
        })
    } catch(error) {
        console.log(error)
    }
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

function handleStation(bot, msg, station) {
    departures(station.id, new Date()).then(
        departure => handleDeparture(bot, msg, station, departure)
    ).catch(error => {
        bot.sendMessage(msg.chat.id, 'Fehler ' + error)
    })
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

// fetch(`https://gtfs.leipzig.codefor.de/otp/routers/default/index/stops/${stopid}/stoptimes`).then(
//   result => {return result.json()}
// ).then(console.log)
