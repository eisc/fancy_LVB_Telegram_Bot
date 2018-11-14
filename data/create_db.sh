#!/bin/bash
DB="mdv.db"
source ftp_settings.cfg

unzip -q -o $FILE

# create sqlite db
rm $DB
sqlite3 $DB <<<$'.mode csv\n.import agency.txt agency\n'
sqlite3 $DB <<<$'.mode csv\n.import calendar_dates.txt calendardates\n'
sqlite3 $DB <<<$'.mode csv\n.import calendar.txt calendar\n'
sqlite3 $DB <<<$'.mode csv\n.import routes.txt routes\n'
sqlite3 $DB <<<$'.mode csv\n.import stops.txt stops\n'
sqlite3 $DB <<<$'.mode csv\n.import stop_times.txt stoptimes\n'
sqlite3 $DB <<<$'.mode csv\n.import transfers.txt transfers\n'
sqlite3 $DB <<<$'.mode csv\n.import stops.txt stops\n'
sqlite3 $DB <<<$'.mode csv\n.import trips.txt trips\n'
