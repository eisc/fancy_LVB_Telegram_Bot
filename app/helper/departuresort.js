exports.compareDepartureEntries = function (entry1, entry2) {
  function compareDirection() {
    return compareStrings(entry1[1], entry2[1], () => 0)
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
  return convertNumberStr(departure) + convertNumberStr(delay)
}

function convertNumberStr(delayStr) {
  if(!Number.isFinite(delayStr)) {
    return delayStr.length === 0
      ? 0
      : Number(delayStr)  
  }
  return delayStr
}
