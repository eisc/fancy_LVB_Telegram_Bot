var Database = require('better-sqlite3');
var db = new Database('lvb.db');

// find all stations with substring in name
// getStationsByName('Lütz', 5);
function getStationsByName(_name, _maxResults) {
    let sql = 'select stop_id, stop_name, stop_lat, stop_lon '
            + 'from stops '
            + 'where stop_name like \'%' + _name + '%\' '

    if (_maxResults > 0) {
        sql+= 'limit ' + _maxResults
    }

    let stmt = db.prepare(sql).all()

    console.dir(stmt);
    return stmt;
}

// get arrivals by stop_id
// getArrivalsByStopId('0013196', 0)
function getArrivalsByStopId(_stopId, _maxResults) {
    let sql = 'select st.arrival_time, st.stop_id, s.stop_name, s.stop_lat, s.stop_lon '
            + 'from stop_times st ' 
            + 'inner join stops s on st.stop_id = s.stop_id '
            + 'where st.stop_id = \'' + _stopId + '\' '

    if (_maxResults > 0) {
        sql+= 'limit ' + _maxResults
    }
            
    let stmt = db.prepare(sql).all()

    console.dir(stmt);
    return stmt;
}

function getClosestStations() {
    let sql = 'select stop_id, stop_name, stop_lat, stop_lon from stops limit 5'
            
    let stmt = db.prepare(sql).all()

    let distance = 2
    stmt.forEach(function(station){

        distance++;
        station.distance = distance;
        console.log(station)
    })

    //console.dir(stmt);
    return stmt;
}

getClosestStations()