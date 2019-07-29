const fetch = require('node-fetch')
const NodeCache = require('node-cache')
const gtfsCache = new NodeCache();
const stopKey = "stops"

exports.fetchAllStops = async function() {
  const stops = gtfsCache.get(stopKey)
  if(stops) {
    return stops;
  }
  const result = await fetch('https://gtfs.leipzig.codefor.de/otp/routers/default/index/stops')
  const retrievedStops = await result.json()
  gtfsCache.set(stopKey, retrievedStops)
  return retrievedStops
}