process.env['NTBA_FIX_319'] = 1

const startUseCase = require('./usecases/start')
const helpUseCase = require('./usecases/help')
const contextUseCase = require('./usecases/context')
const planUseCase = require('./usecases/plan')
const quickselectAddUseCase = require('./usecases/quickselect/addition')

const useCases = [ startUseCase, helpUseCase, contextUseCase, planUseCase ]

const { handleCommandReset } = require('./handler/reset')
const { handleCommandLocation } = require('./handler/location')
const { handlePotentialStation } = require('./handler/station')

const bot = require('./helper/bot').createBot()
useCases.forEach(useCase => useCase.registerListener(bot))
quickselectAddUseCase.registerListener(bot, contextUseCase.isInCurrentContext)


//1) rename handleMatchingStation, because it is no handler-function
//2) try to remove bot-object from this function, if possible
//bot-obj is not given further as argument - therefore handleMatchingStation can stay part of the Interface (respectively the Controller)
bot.onText(/\/reset(\s*)(.*)/, (msg, match) => handleCommandReset(bot, msg, match))
//ToDo: bot-object-argument still in multiple functions
//but all theses Function can be declared as controller-Functions
//controller (interface) is therefore clean
bot.on('location', (msg) => handleCommandLocation(bot, msg))  //ToDo: bot-object still in multiple functions, seems difficult to separate
//more Domain-Knowledge needed to decide how to separate
//in location.ja, line 26, import not found

bot.on("inline_query", function (data) {
    if (startUseCase.commandRegex.test(data.query)) {
        startUseCase.handleInline(bot, data.id)
    } else if (helpUseCase.commandRegex.test(data.query)) {
        helpUseCase.handleInline(bot, data.id)
    } else if (contextUseCase.commandRegex.test(data.query)) {
        contextUseCase.handleInline(bot, data.id)
    } else if (planUseCase.commandRegex.test(data.query)) {
        planUseCase.handleInline(bot, data.id)
    } else {
        var content = data.query;
        if (content.startsWith("/")) {
            return;
        }
        console.log(content);
        const list = [
            {
                id: '0',
                type: 'article',
                title: 'Gerichtsweg',
                message_text: 'Abfahrt Gerichtsweg'
            },
            {
                id: '1',
                type: 'article',
                title: 'Münzgasse',
                message_text: 'Abfahrt Münzgasse'
            },
            {
                id: '2',
                type: 'article',
                title: 'Steinweg',
                message_text: 'Abfahrt Steinweg'
            }
        ]
        // examples:
        // * https://github.com/yagop/node-telegram-bot-api/issues/557
        // * https://github.com/yagop/node-telegram-bot-api/issues/729
        // * 

        /*     interface InlineQueryResultBase {
                id: string;
                reply_markup?: InlineKeyboardMarkup;
            }
        
            interface InlineQueryResultArticle extends InlineQueryResultBase {
                type: 'article';
                title: string;
                input_message_content: InputMessageContent;
                url?: string;
                hide_url?: boolean;
                description?: string;
                thumb_url?: string;
                thumb_width?: number;
                thumb_height?: number;
            } */

        // todos
        // * take data.query string, fetch stations, display
        bot.answerInlineQuery(data.id, list);
        // to send message to bot directly
        //bot.sendMessage(data.from.id, "hello world");
    }
});

const noKeyword = /^((?!(\/start|\/help|\/plan|\/add|\/context|\/reset)).)*$/
bot.onText(noKeyword, (msg, match) => handlePotentialStation(bot, msg, match, contextUseCase.isInCurrentContext))  //ToDo: bot-object still in multiple functions, seems difficult to separate
                                                                                                    //more Domain-Knowledge needed to decide how to separate