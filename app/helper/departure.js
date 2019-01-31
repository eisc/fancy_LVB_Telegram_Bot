const moment = require('moment')
const table = require('text-table')
var fixedDate = null

exports.handleDeparture = function (bot, msg, station, departureResults) {
  if (departureResults.length) {
    const departures = createAnswerForDepartureResult(departureResults)
    if(departures.length === 0) {
      bot.sendMessage(msg.chat.id, `Keine aktuellen Abfahrten für *${station.name}* gefunden.`, 
        { parse_mode: 'Markdown' })
    } else {
      var sliceStart = 0;
      const sliceSize = 10;
      sendDepartureMessage(bot, msg, station, departures, sliceStart, sliceSize)
    }
  }
}

function sendDepartureMessage(bot, msg, station, departures, sliceMin, sliceSize) {
  const sliceMax = getSliceMax(departures, sliceMin, sliceSize)
  const answer = departures.slice(sliceMin, sliceMax)
  const departTableStr = departureTable(station, answer)
  bot.sendMessage(msg.chat.id, departTableStr, moreQuery(departures, sliceMax, sliceSize));
  addCallbackHandler(bot, sliceMax, sliceSize, departures, station, msg)
}

function addCallbackHandler(bot, sliceStart, sliceSize, departures, station, msg) {
  if(departures.length <= sliceStart) {
    return
  }
  bot.once('callback_query', query => {
    bot.answerCallbackQuery(query.id)
    if (query.data === `more_departures_${sliceStart}`) {
      sendDepartureMessage(bot, msg, station, departures, sliceStart, sliceSize)
    }
  })
}

function getSliceMax(departures, sliceMin, sliceSize) {
  const sliceMax = sliceMin + sliceSize
  if(sliceMax > departures.length) {
    return departures.length
  }
  return sliceMax;
}

function departureTable(station, answer) {
  return `Abfahrten für *${station.name}*\n${"`"}${answerToTable(answer)}${"`"}`
}

function answerToTable(answer) {
  const style = { 
    align: ['r', 
      'l', 
      'r'] 
  };
  return table(answer, style)
}

function moreQuery(departures, sliceStart) {
  if(departures.length <= sliceStart) {
    return { parse_mode: 'Markdown' }
  }
  return { 
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [[{ 
        text: 'mehr anzeigen', 
        callback_data: `more_departures_${sliceStart}`
      }]]
    } 
  }
}

function createAnswerForDepartureResult(departureResults) {
  var departure = []
  departureResults.forEach(res => {
    res.timetable.forEach(time => {
      departure.push([
        res.line.id,
        res.line.direction,
        handleDepartureTime(time),
        handleDelay(time)
      ])
    })
  })
  departure.sort((entry1, entry2) => compareDepartureEntries(entry1, entry2))
  return departure
}

function compareDepartureEntries(entry1, entry2) {
  function compareDirection() {
    return compareStrings(entry1[1], entry2[1], () => -1)
  } 
  function compareLineIds() {
    return compareStrings(entry1[0], entry2[0], compareDirection)  
  }
  return compareDepartures(entry1[2], entry1[3], entry2[2], entry2[3], compareLineIds)
}

function compareStrings(string1, string2, nextCompareFun) {
  const compareResult = string1.localeCompare(string2);
  if(compareResult === 0) {
    return nextCompareFun();
  }
  return compareResult;
}

function compareDepartures(departure1, delay1, departure2, delay2, nextCompareFun) {
  const totalDeparture1 = totalDeparture(departure1, delay1)
  const totalDeparture2 = totalDeparture(departure2, delay2)
  const compareResult = totalDeparture1 - totalDeparture2;
  if(compareResult === 0) {
    return nextCompareFun();
  }
  return compareResult
}

function totalDeparture(departure, delay) {
  return departure + convertNumberStr(delay)
}

function convertNumberStr(delayStr) {
  return delayStr === '' 
    ? 0 
    : Number(delayStr)
}

function handleDepartureTime(time) {
    const depTime = new Date(Date.parse(time.departure))
    const diffToNow = moment(depTime).diff(referenceTime())
    const diffInMinutes = moment.duration(diffToNow).as('minutes')
    var departureInMinutes = Math.floor(diffInMinutes)
    return departureInMinutes === 0 
      ? '' 
      : departureInMinutes
}

function referenceTime() {
  return fixedDate 
    ? fixedDate
    : moment();
}

function handleDelay(time) {
    const delayMinutes = Math.floor(time.departureDelay / 60000);
    if (delayMinutes === 0) {
      return ''
    }
    const sign = delayMinutes > 0
      ? '+'
      : '';
    return ` ${sign}${delayMinutes}`
}