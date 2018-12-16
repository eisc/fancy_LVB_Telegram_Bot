var expect = require('chai').expect;
var { createBot } = require('../../../app/helper/bot');
const { TELEGRAM_TOKEN } = require('../../../config/config')

describe('test createBot', () => {

    it('should created bot with polling true and with config token', () => {
        const createdBot = createBot();
        expect(createdBot.options.polling).to.be.true
        expect(createdBot.token).to.equal(TELEGRAM_TOKEN)        
    });
})