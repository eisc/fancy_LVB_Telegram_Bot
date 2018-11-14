var Database = require('better-sqlite3');
var db = new Database('./data/lvb.db');

// find all stations with substring in name
// getStationsByName('Lütz', 5);
function getStationsByName(_name, _maxResults) {
    let sql = 'select stop_id, stop_name, stop_lat, stop_lon '
        + 'from stops '
        + 'where stop_name like \'%' + _name + '%\' '

    if (_maxResults > 0) {
        sql += 'limit ' + _maxResults
    }
    console.log("SQL: ", sql);
    try {
        let stmt = db.prepare(sql).all()
        console.dir(stmt);
        return stmt;
    } catch(error) {
        console.log(error);
        return [];
    }
}

// get arrivals by stop_id
// getArrivalsByStopId('0013196', 0)
function getArrivalsByStopId(_stopId, _maxResults) {
    let sql = 'select st.arrival_time, st.stop_id, s.stop_name, s.stop_lat, s.stop_lon '
        + 'from stop_times st '
        + 'inner join stops s on st.stop_id = s.stop_id '
        + 'where st.stop_id = \'' + _stopId + '\' '

    if (_maxResults > 0) {
        sql += 'limit ' + _maxResults
    }
    console.log("SQL: ", sql);

    try {    
        let stmt = db.prepare(sql).all()
        console.dir(stmt);
        return stmt;
    } catch(error) {
        console.log(error);
        return [];
    }
}

// get the N closest stations next to your position
// getClosestStations('51.326440', '12.342333', 8)
function getClosestStations(_lat, _lon, _count) {
    let sql = 'select stop_id, stop_name, stop_lat, stop_lon from stops'
    let stmt = db.prepare(sql).all()

    stmt.forEach(function (station) {
        station.distance = Math.sqrt(Math.pow(_lat - station.stop_lat, 2) + Math.pow(_lon - station.stop_lon, 2));
    })

    let sortedByDistance = sortBy(stmt, ['distance'])
    return sortedByDistance.slice(0,_count);
}

module.exports = {
    getStationsByName: getStationsByName,
    getArrivalsByStopId: getArrivalsByStopId,
    getClosestStations: getClosestStations
}
