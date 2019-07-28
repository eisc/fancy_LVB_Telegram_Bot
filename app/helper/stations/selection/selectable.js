exports.transformToSelectableStationNames = function (stations) {
  if(stations.length === 0) {
    return [[]]
  }
  return stations.map(station => {
    return [{ text: station.name, callback_data: station.id }];
  });
}
