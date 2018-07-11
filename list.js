'use strict';

const Telegram = require('telegram-node-bot');


class AddController extends Telegram.TelegramBaseController {
  addHandler($){
    $.sendChatAction('typing');

    let add = $.message.text.split(' ').slice(1).join(' ');
    if (!add) return $.sendMessage('Please enter a name.');
    $.getUserSession('adds')
    .then(adds => {
      console.log('adds', adds);
      if (!Array.isArray(adds)) {
        console.log('not array set', add);
        return $.setUserSession('adds', [add]);
      } else {
        console.log('array set');
        return $.setUserSession('adds', adds.push(add));
      }
    }).then(() => {
      console.log('after set');
      return $.getUserSession('adds');
    }).then(data => {
      let menuButtons = {};
      for (var i = 0; i < data.length; i++) {
        let station = data[i];
        menuButtons[station] = {message: 'blabal' + i};
      }
      console.log(menuButtons);
      $.runMenu({
        message: `${add} was added.`,
        ...menuButtons
      });
    })
  };

removeHandler($){
  $.sendChatAction('typing');

  let index = parseInt($.message.text.split(' ').slice(1)[0]);
  if (isNaN(index)) return $.sendMessage('Sorry, you didn\'t pass a valid index.');

  $.getUserSession('adds')
  .then(adds => {
    if (index >= adds.length) return $.sendMessage('Sorry, you didn\'t pass a valid index.');
    adds.splice(index, 1);
    $.setUserSession('adds', adds);
    $.sendMessage('Something was removed.');
  });
}


get routes() {
  return {
    'addCommand': 'addHandler',
    'listCommand': 'listHandler',
    'removeCommand': 'removeHandler'
      };
}}

module.exports = AddController;
