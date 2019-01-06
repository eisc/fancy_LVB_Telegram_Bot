const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const sut = rewire('../../../app/helper/gtfs.js');

describe('test helper module gtfs', () => {
    const requestURL = 'https://gtfs.leipzig.codefor.de/otp/routers/default/index/stops'

    describe('test fetchAllStops', () => {
        const gtfsCacheStub = {
            get: () => null,
            set: () => null
        }

        beforeEach(() => {
            sut.__set__('gtfsCache', gtfsCacheStub)
        })

        afterEach(() => {
            sinon.restore()
        })

        it('when cache empty, fetch result is set to cache before result is returned', (done) => {
            const jsonContent = [{
                dummy: "dummy"
            }]
            const stops = {
                json: () => jsonContent
            }
            const fetchFake = sinon.fake.resolves(stops)
            sut.__set__('fetch', fetchFake)

            const gtfsCacheGetStub = sinon.stub(gtfsCacheStub, 'get')
            const gtfsCacheSetSpy = sinon.spy(gtfsCacheStub, 'set')

            const result = sut.fetchAllStops()

            result.then((content) => {
                expect(content).to.equal(jsonContent);
                assertGetterSetterInteractions(gtfsCacheGetStub, gtfsCacheSetSpy, fetchFake, jsonContent)
                done();
            });
        })

        it('when cache not empty, cache content is returned directly', (done) => {
            const jsonContent = [{
                dummy: "dummy"
            }]
            const stops = {
                json: () => jsonContent
            }
            const fetchFake = sinon.fake.returns(Promise.resolve(stops))
            sut.__set__('fetch', fetchFake)

            const gtfsCacheGetStub = sinon.stub(gtfsCacheStub, 'get')

            const result = sut.fetchAllStops()
            result.then((content) => {
                expect(content).to.equal(jsonContent);
                assertCacheGetInteraction(gtfsCacheGetStub)
                done();
            });
        })

        it('when cache empty, and fetch throws error, empty list is returned', (done) => {
            const fetchFake = sinon.fake.throws(new Error())
            sut.__set__('fetch', fetchFake)

            const gtfsCacheGetStub = sinon.stub(gtfsCacheStub, 'get')

            const result = sut.fetchAllStops()

            result.then((content) => {
                expect(content).to.be.empty;
                assertCacheGetInteraction(gtfsCacheGetStub)
                assertFetchInteraction(fetchFake)
                done();
            });
        })

        function assertGetterSetterInteractions(gtfsCacheGetStub, gtfsCacheSetSpy, fetchFake, 
                jsonContent) {
            assertCacheGetInteraction(gtfsCacheGetStub)
            assertFetchInteraction(fetchFake)
            assertCacheSetInteraction(gtfsCacheSetSpy, jsonContent)
        }

        function assertCacheGetInteraction(gtfsCacheGetStub) {
            const cacheCall1 = gtfsCacheGetStub.getCall(0);
            expect(cacheCall1.args[0]).to.equal('stops');
        }

        function assertFetchInteraction(fetchFake) {
            const fetchCall = fetchFake.getCall(0);
            expect(fetchCall.args[0]).to
                .equal(requestURL);
        }

        function assertCacheSetInteraction(gtfsCacheSetSpy, jsonContent) {
            const cacheCall2 = gtfsCacheSetSpy.getCall(0);
            expect(cacheCall2.args[0]).to.equal('stops');
            expect(cacheCall2.args[1]).to.equal(jsonContent);
        }
    });
});