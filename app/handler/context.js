var currentContext = null

exports.handleContext = function (bot, msg, match) {
    if (match[2] === '') {
      bot.sendMessage(msg.chat.id, 'Bitte gib einen Stadtnamen (oder "MDV" für alle) ein.')
      return
    }
    setContext(bot, msg, match[2])
}

function setContext (bot, msg, context) {
  if(context === 'MDV') {
    bot.sendMessage(msg.chat.id, '"MDV" erfolgreich als context gesetzt')
    currentContext = null
  } else if (context === 'Leipzig') {
    currentContext = context
    bot.sendMessage(msg.chat.id, '"Leipzig" erfolgreich als context gesetzt, reset mit /context MDV jederzeit möglich')
  } else {
    bot.sendMessage(msg.chat.id, 'Nur "MDV" und "Leipzig" sind derzeit als context erlaubt')
  }
}

exports.isInCurrentContext = function (station) {
  if(!currentContext) {
    return true
  } else if(currentContext === 'Leipzig' 
      && (station.name.startsWith('Leipzig,') || station.name.startsWith('Leipzig-'))) {
        return true;
  }
  return false;
}

  