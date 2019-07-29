const fetch = require('node-fetch')
const moment = require('moment')
const gtfs2lvb = require('../format/gtfs2lvb')

async function getGtfsDeparturesForStation (stopId) {
  const now = moment().format('YYYYMMDD')
  const response = await fetch(`https://gtfs.leipzig.codefor.de/otp/routers/default/index/stops/${stopId}/stoptimes/${now}`)
  const retrievedDepartures = JSON.parse(response.text())
  return gtfs2lvb.transformToLvbLayout(retrievedDepartures)
}
exports.getGtfsDeparturesForStation = getGtfsDeparturesForStation