/* eslint no-underscore-dangle: ["error", { "allow": ["__get__", "__set__"] }] */
const expect = require('chai').expect;
const sinon = require('sinon');
const rewire = require('rewire');
const sut = rewire('../../../app/handler/plan');

describe('test plan handler', () => {
    var bot = null;
    var sendMessageSpy = null;
    var msg = null;
    const myChatId = 'myChatId'

    beforeEach(() => {
        bot = {
            sendMessage: () => null,
            once: () => null,
            answerCallbackQuery: () => null,
            sendChatAction: () => null,
            sendDocument: () => null
        };
        sendMessageSpy = sinon.spy(bot, 'sendMessage');
        msg = {
            chat: {
                id: myChatId
            }
        }
    });

    afterEach(() => {
        sinon.restore()
    });

    describe('test handleCommandPlan', () => {
        it('handle selection 2 should return pdf document 2', () => {
            const selectionSpy = sinon.spy(bot, 'once')
            const callbackSpy = sinon.spy(bot, 'answerCallbackQuery')
            const sendActionSpy = sinon.spy(bot, 'sendChatAction')
            const sendDocSpy = sinon.spy(bot, 'sendDocument')
            const jmapFake = [
                { path: 'path1', title: 'title1', description: 'desc1' },
                { path: 'path2', title: 'title2', description: 'desc2' },
                { path: 'path3', title: 'title3', description: 'desc3' },
                { path: 'path4', title: 'title4', description: 'desc4' }
            ]
            sut.__set__('jmap', jmapFake)

            sut.handleCommandPlan(bot, msg)

            assertQueryForPlan(sendMessageSpy, myChatId);
            const queryListener = assertRegistrationOfSelectionListener(selectionSpy);

            assertSendingTheRightDocument(queryListener, myChatId, callbackSpy,
                sendActionSpy, sendDocSpy);
        })
    })
})

function assertSendingTheRightDocument(queryListener, myChatId, callbackSpy,
        sendActionSpy, sendDocSpy) {
    const query = {
        id: 'myQueryId',
        data: '1'
    };
    queryListener(query);

    expect(callbackSpy.getCall(0).args[0]).to.equal(query.id)

    expect(sendActionSpy.getCall(0).args[0]).to.equal(myChatId)
    expect(sendActionSpy.getCall(0).args[1]).to.equal('upload_document')

    expect(sendDocSpy.getCall(0).args[0]).to.equal(myChatId)
    expect(sendDocSpy.getCall(0).args[1]).to.equal('path2')

    const doc = sendDocSpy.getCall(0).args[2]
    const expectedDoc = {
        caption: '*title2*\ndesc2',
        parse_mode: 'Markdown'
    }
    expect(doc).to.deep.eq(expectedDoc)
}

function assertRegistrationOfSelectionListener(selectionSpy) {
    const call = selectionSpy.getCall(0);
    expect(call.args[0]).to.equal('callback_query');
    const queryListener = call.args[1];
    return queryListener;
}

function assertQueryForPlan(sendMessageSpy, myChatId) {
    const call = sendMessageSpy.getCall(0);
    expect(call.args[0]).to.equal(myChatId);
    expect(call.args[1]).to.equal('Welchen Netzplan möchtest du haben?');
    const expectedSelection = call.args[2];
    expect(expectedSelection['reply_markup']['inline_keyboard'][0][0]).to.deep
        .equal({ text: 'Gesamtnetz Leipzig', callback_data: '0' });
    expect(expectedSelection['reply_markup']['inline_keyboard'][0][1]).to.deep
        .equal({ text: 'Liniennetz Nacht', callback_data: '1' });
    expect(expectedSelection['reply_markup']['inline_keyboard'][1][0]).to.deep
        .equal({ text: 'Stadtplan Leipzig', callback_data: '2' });
    expect(expectedSelection['reply_markup']['inline_keyboard'][1][1]).to.deep
        .equal({ text: 'Tarifzonenplan MDV', callback_data: '3' });
}
