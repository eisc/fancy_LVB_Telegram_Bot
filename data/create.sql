/* https://alvinalexander.com/android/sqlite-create-table-insert-syntax-examples
 * SQLite CREATE TABLE examples.
 * Created by Alvin Alexander, http://alvinalexander.com
 * Released under the Creative Commons License.
 */

CREATE TABLE calendar_dates (
  service_id TEXT NOT NULL,
  date TEXT NOT NULL,
  exception_type TEXT NOT NULL
);

CREATE TABLE calendar (
  service_id TEXT NOT NULL,
  monday TEXT NOT NULL,
  tuesday TEXT NOT NULL,
  wednesday TEXT NOT NULL,
  thursday TEXT NOT NULL,
  friday TEXT NOT NULL,
  saturday TEXT NOT NULL,
  sunday TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL
);

CREATE TABLE routes (
  route_id TEXT NOT NULL,
  agency_id TEXT NOT NULL,
  route_short_name TEXT NOT NULL,
  route_long_name TEXT NOT NULL,
  route_type TEXT NOT NULL
);

CREATE TABLE stop_times (
  trip_id TEXT NOT NULL,
  arrival_time TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  stop_id TEXT NOT NULL,
  stop_sequence TEXT NOT NULL,
  pickup_type TEXT NOT NULL,
  drop_off_type TEXT NOT NULL
);

CREATE TABLE stops (
  stop_id TEXT NOT NULL,
  stop_name TEXT NOT NULL,
  stop_lat TEXT NOT NULL,
  stop_lon TEXT NOT NULL
);

CREATE TABLE transfers (
  from_stop_id TEXT NOT NULL,
  to_stop_id TEXT NOT NULL,
  transfer_type TEXT NOT NULL,
  min_transfer_time TEXT NOT NULL
);

CREATE TABLE trips (
  route_id TEXT NOT NULL,
  service_id TEXT NOT NULL,
  trip_id TEXT NOT NULL,
  trip_headsign TEXT NOT NULL,
  direction_id TEXT NOT NULL
);

