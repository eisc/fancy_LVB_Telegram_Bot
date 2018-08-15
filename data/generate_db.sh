#!/bin/sh

echo 'remove lvb.db'
rm lvb.db

echo 'create tables'
sqlite3 lvb.db < create.sql

echo 'correct routes.txt'
sed -i -e 's/,,/,/g' routes.txt

echo 'import csv files'
sqlite3 lvb.db < import_csv.sqlite

