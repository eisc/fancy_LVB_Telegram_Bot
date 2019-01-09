# fancy_LVB_Telegram_Bot

[![Coverage Status](https://coveralls.io/repos/github/eisc/fancy_LVB_Telegram_Bot/badge.svg?branch=master)](https://coveralls.io/github/eisc/fancy_LVB_Telegram_Bot?branch=master)

# TODOs

 * Fahrplandaten einfügen
 * Haltestelle per Eingabe anfragen (-> Ausgabe: nächsten Abfahrten an der Haltestelle)
 * nächstgelegenen Haltestellen per Standort anfragen
 * nächstgelegenen Haltestellen auf Karte anzeigen

## Telegram Bot anlegen

 * BotFather als Kontakt in Telegram hinzufügen
 * mit /newbot einen neuen Bot anlegen, name und username festlegen
 * im geclonten Git repository config/config.js anlegen mit Inhalt
```
exports.TELEGRAM_TOKEN = "<vom BotFather generierter Access-Token für den eben angelegten neuen Bot>"
```

## Start ohne Docker
 * Node.js installieren, z.B. so wie hier beschrieben: https://blog.pm2.io/install-node-js-with-nvm/
 * `npm install`
 * config/maps.js anpassen so dass die public/maps/ Ressourcen mit ihren absoluten Pfaden adressiert werden
 * `npm run start`


## Start mit Docker

```
docker build -t fancy_lvb_bot
docker run -v /etc/localtime:/etc/localtime:ro -v /etc/timezone:/etc/timezone:ro --restart=always --name fancylvbbot -d fancy_lvb_bot:latest
```

## Test-Ausführung

 * ohne Code coverage: * `npm run test`
 * mit Code coverage: * `npm run test-with-coverage` - unter coverage/lcov-report/index.html findet man dann den Testabdeckungsreport
