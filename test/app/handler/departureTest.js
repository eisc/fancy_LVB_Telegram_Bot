const { departures } = require('lvb')

describe('test departure calculation', () => {

    it.skip('should send expected personalized welcome message', () => {
        departures('abc', new Date()).then(
            departure => console.log(JSON.stringify(departure, null, 2))
        ).catch(error => {
            console.log(JSON.stringify(error, null, 2))
        })
    });
});