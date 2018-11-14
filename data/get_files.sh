#!/bin/bash
source ftp_settings.cfg

ftp -p -n $HOST <<EOF
quote USER $USER
quote PASS $PASSWD
binary
cd $FOLDER
get $FILE
quit

EOF
