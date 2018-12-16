var expect = require('chai').expect;
var sinon = require('sinon');
var { handleCommandStart, handleCommandHelp } = require('../../../app/handler/general');

describe('test handleCommandStart and handleCommandHelp', () => {
    var bot = null;
    var sendMessageSpy = null;
    var msg = null;
    const myChatId = 'myChatId'

    beforeEach(() => {
      bot = {
        sendMessage: () => null
      };
      sendMessageSpy = sinon.spy(bot, 'sendMessage');
      msg = {
        chat: {
          id: myChatId
        }
      };
    });

    afterEach(() => {
     sinon.restore()
    });

    describe('test handleCommandStart', () => {
      const fromName = 'Hans'
      
      beforeEach(() => {
        msg = {
          ...msg,
          from: {
            first_name: fromName
          }
        };
      });
  
      it('should send expected personalized welcome message', () => {
        handleCommandStart(bot, msg)
        const call = sendMessageSpy.getCall(0);
        expect(call.args[0]).to.equal(myChatId);
        expect(call.args[1].startsWith('Hallo ' + msg.from.first_name)).to.be.true;
        expect(call.args[1].includes('helfe dir gerne bei den Abfahrtszeiten')).to.be.true;
        expect(call.args[1].includes('Bei /help werden dir alle Funktionen ' 
          + 'dieses Bots aufgelistet')).to.be.true;
      });      
    });

    describe('test handleCommandHelp', () => {

      it('should send expected help message', () => {
        handleCommandHelp(bot, msg)
        const call = sendMessageSpy.getCall(0);
        expect(call.args[0]).to.equal(myChatId);
        expect(call.args[1].startsWith('Hier eine Übersicht über alle Funkionen:')).to.be.true;
        expect(call.args[1].includes('Mit /plan ')).to.be.true;
        expect(call.args[1].includes('Mit /add ')).to.be.true;
        expect(call.args[1].includes('Mit /reset ')).to.be.true;
        expect(call.args[1].includes('Mit /onlocation ')).to.be.true;
        expect(call.args[1].includes('Bei /station ')).to.be.true;
      });      
    });    
});
