#!/bin/bash
cd ~/git/fancy_LVB_Telegram_Bot
docker rm -f fancylvbbot
git checkout master
git pull
docker build -t fancy_lvb_bot .
docker run -v /etc/localtime:/etc/localtime:ro -v /etc/timezone:/etc/timezone:ro --restart=always --name fancylvbbot -d fancy_lvb_bot:latest
