/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */
const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const sut = rewire('../../../app/helper/bot');
const createBot = sut.createBot;
const getTelegramToken = sut.__get__('getTelegramToken')

describe('test bot creation', () => {
  const myPredefinedToken = 'myPredefinedToken'

  describe('test createBot', () => {

    it('should created bot with polling true and with config token from env', () => {
      sut.__set__('telegramToken', 'myPredefinedToken')
      function botStub() {
        return null
      }
      const botSpy = sinon.spy(botStub)
      sut.__set__('createBotWithArgs', botSpy)
      createBot();
      const call = botSpy.getCall(0);
      expect(call.args[0].telegramToken).to.equal(myPredefinedToken)
      expect(call.args[0].options).to.deep.eql({ polling: true });
    });
  })

  describe('test getTelegramToken', () => {
    it('should return dummy token, when no env and file not readable', () => {
      expect(getTelegramToken('TELEGRAM_TOKEN', './tmp.js')).to.equal('dummyToken')
    });

    describe('test getTelegramToken with env token', () => {
      const myToken = 'myToken'

      beforeEach(() => {
        process.env['TELEGRAM_TOKEN'] = myToken
      })

      afterEach(() => {
        process.env['TELEGRAM_TOKEN'] = null
      })

      it('should return predefined token from env', () => {
        expect(getTelegramToken('TELEGRAM_TOKEN', './tmp.js')).to.equal(myToken)
      });
    })
  })
})