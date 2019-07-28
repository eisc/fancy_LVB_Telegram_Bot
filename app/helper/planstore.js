const maps = require('../../config/maps.json')

exports.getPlanPath = function (index) {
  return maps[index].path
}

exports.getPlanAsDocument = function (index) {
  return {
    caption: `*${maps[index].title}*\n${maps[index].description}`,
    parse_mode: 'Markdown'
  }
}
