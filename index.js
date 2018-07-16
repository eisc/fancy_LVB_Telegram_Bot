'use strict'

let config = require('./config');

const Telegram = require('telegram-node-bot'),
  tg = new Telegram.Telegram(config.TELEGRAM_TOKEN, {
    workers: 1
  });


class StartController extends Telegram.TelegramBaseController {
  handle($) {
    $.sendMessage('This is the magic.');
  }
}
class VersionController extends Telegram.TelegramBaseController {
  handle($) {
    $.sendChatAction('typing');
    $.sendMessage('version 1.337');
  }
}
class PlanController extends Telegram.TelegramBaseController {
  handle($) {
    $.sendChatAction('upload_photo');
    $.sendPhoto('http://phototrans.de/images/schemas/original/71/914.jpg');
    $.sendDocument({ path: 'Netzplan_Tag.pdf' })
  }
}

class OtherwiseController extends Telegram.TelegramBaseController {
  handle($) {
    $.sendChatAction('typing');
    $.sendMessage('Sorry, try again.');
  }
}

const ListController = require('./list');
const listCtrl = new ListController();

tg.router.when(new Telegram.TextCommand('/start'), new StartController())
  .when(new Telegram.TextCommand('/version'), new VersionController())
  .when(new Telegram.TextCommand('/plan'), new PlanController())
  .when(new Telegram.TextCommand('/list', 'listCommand'), listCtrl)
  .when(new Telegram.TextCommand('/add', 'addCommand'), listCtrl)
  .when(new Telegram.TextCommand('/remove', 'removeCommand'), listCtrl)
  .otherwise(new OtherwiseController());
