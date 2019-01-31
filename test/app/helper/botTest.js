const expect = require('chai').expect;
const { createBot } = require('../../../app/helper/bot');
//const { TELEGRAM_TOKEN } = require('../../../config/config')

describe('test createBot', () => {

    // cannot be tested remotely because config file not checked in
    it.skip('should created bot with polling true and with config token', () => {
        const createdBot = createBot();
        expect(createdBot.options.polling).to.be.true
        //expect(createdBot.token).to.equal(TELEGRAM_TOKEN)
    });
})