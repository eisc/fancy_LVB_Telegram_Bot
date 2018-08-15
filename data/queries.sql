
-- finde haltestelle nach namen
Eingabe: Namensstück, anzahl resultate
select stop_id, stop_name, stop_lat, stop_lon 
from stops where stop_name like '%Lütz%' limit 10

-- abfahrten an einer haltestelle mit koordinaten
select st.arrival_time, st.stop_id, s.stop_name, s.stop_lat, s.stop_lon 
from stop_times st 
inner join stops s on st.stop_id = s.stop_id


-----
select * from calendar_dates cd 
inner join trips t on cd.service_id = t.service_id


select t.route_id, st.trip_id,st.arrival_time, st.stop_id, s.stop_name, cd.service_id, cd.date
from stop_times st 
inner join stops s on st.stop_id = s.stop_id 
inner join trips t on st.trip_id = t.trip_id
inner join calendar_dates cd on cd.service_id = t.service_id
where st.trip_id = '15946'
order by cd.date

--- endhaltestellen von einer haltestelle, incl lat lon
(stop_id)



-- abstand (5 nächstgelegensten haltestellen)
eingabe: stop_id, anzahl oder distanz
ausgabe: lat, lon, namen