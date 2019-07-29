function offerMatchingStationsForSelection (stations) {
  const stationNames = transformToSelectableStationNames (stations)
  return {
    reply_markup: {
      inline_keyboard: stationNames
    }
  }
}

function transformToSelectableStationNames (stations) {
  if(stations.length === 0) {
    return [[]]
  }
  return stations.map(station => {
    return [{ text: station.name, callback_data: station.id }];
  });
}

module.exports = Object.freeze({
  offerMatchingStationsForSelection,
  transformToSelectableStationNames
});
