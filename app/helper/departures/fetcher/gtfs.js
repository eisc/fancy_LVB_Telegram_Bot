const fetch = require('node-fetch')
const moment = require('moment')
const gtfs2lvb = require('../format/gtfs2lvb')

async function getGtfsDeparturesForStation (stop) {
  const now = moment().format('YYYYMMDD')
  const response = await fetch(`https://gtfs.leipzig.codefor.de/otp/routers/default/index/stops/${stop.id}/stoptimes/${now}`)
  try {
    const text = await response.text()
    const retrievedDepartures = await JSON.parse(text)
    const layout = await gtfs2lvb.transformToLvbLayout(retrievedDepartures)
    return await layout
  } catch(e) {
    return Promise.resolve([])
  } 
}
exports.getGtfsDeparturesForStation = getGtfsDeparturesForStation