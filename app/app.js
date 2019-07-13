process.env['NTBA_FIX_319'] = 1

//General Idea:
//all handler-modules should only include handler-functions, i.e. logic, which is concerned with the bot
//this is like the Controller in the MVC-Pattern

//all the "Business-Logic" should be in the helper-modules
//this is like the model in the MVC-Pattern
//the model should not include any bot-functions, it should just pass the required information
//from the "Business-Logic", i.e. the required timetable-Information (as raw data, e.g. strings)
//to the handler-functions

//If you want to use a new View (in terms of the MVC-Pattern), e.g. a Website, another bot (with other functions),
//other technology and so on, you can just change the handler-functions (the Controller)
//(or better add handler-functions for the other technology)
// - the "Business Logic" in the model, respectively in the helper-functions stays stable
//the business-logic will only be adapted if the underlying model changes or further helper-functions are needed
//for other controllers

//Ideal case would be:
//1) Just one little handler-function in the "Controller" per bot-reaction (the functions which are called in this module).
//2) Every of these handler-functions just calls the Information it needs from the model
//(the required functions to fetch information should be in the model),
//3) the handler-function gets back raw data or a string from the model
//4) if it gets raw data, it formats a string and pushes the string to the bot
//   if it gets a string, it pushes the string to the bot
//problem in the actual code: there are still some side effects (set context, format some data, setup a keyboard ...)
//possible solution: the functions should not have side-effects, if possible separate concerns, concentrate all
//bot-related issues (probably the bot needs context, formatting and setting up a keyboard) should go to the handlers
//if the handlers need information, to make this decision about the context, formatting ..., there shoult be
//functions in the model to ask for this information
//(right now it seems to be difficult in somme cases, because the conditions for some decisions seem to change back and forth while
//the information in the model is beeing calculated)

//ToDo:
//in the handler-modules seem to be a few functions, which deal with the business-logic
//these functions should go to the model and out of the handler-modules

//imports:
//maybe better import modules only, name the imports like the module and use as
//[module_name].exportedFunction
//like this it's difficult to follow the code

//examples for inconsequent import-naming:
//const { handleCommandStart, handleCommandHelp } = require('./handler/general')
//const { handleCommandAdd } = require('./handler/stationadd')

const { handleCommandPlan } = require('./handler/plan')
const { handleCommandAdd } = require('./handler/stationadd')
const { handleCommandReset } = require('./handler/reset')
const { handleCommandLocation } = require('./handler/location')
const { handlePotentialStation } = require('./handler/station')

const bot = require('./helper/bot').createBot()
const Eventbus = require('events')
const eventbus = new Eventbus()
const { CONTEXT_SET, START, HELP } = require('./events/events')

const contextUseCase = require('./usecases/context_usecase')
const generalUseCase = require('./usecases/general_usecase')

const contextRegex = /\/context(\s*)(.*)/
const startRegex = /\/start/
const helpRegex = /\/help/

bot.onText(contextRegex, (msg, match) => eventbus.emit(CONTEXT_SET.eventType,
    { chatId: msg.chat.id, context: match[2] }
))
contextUseCase.registerListener(eventbus, bot)

bot.onText(startRegex, (msg) => eventbus.emit(START.eventType, 
    { chatId: msg.chat.id, firstName: msg.chat.first_name }))
bot.onText(helpRegex, (msg) => eventbus.emit(HELP.eventType, { chatId: msg.chat.id }))
generalUseCase.registerListener(eventbus, bot)

bot.onText(/\/plan/, (msg, match) => handleCommandPlan(bot, msg, match)) //bot-object only in one more function 'handlePlanSelection', seems o.k. there,
//'handlePlanSelection' is no handler-function -> rename it
bot.onText(/\/add(\s*)(.*)/, (msg, match) => handleCommandAdd(bot, msg, match, contextUseCase.isInCurrentContext)) //bot-object still in other function handleMatchingStation
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
    if (contextRegex.test(data.query)) {
        eventbus.emit(CONTEXT_SET.eventType,
            { chatId: data.id, isInline: true }
        )
    } else if (startRegex.test(data.query)) {
        eventbus.emit(START.eventType,
             { chatId: data.id, isInline: true }
        )
    } else if (helpRegex.test(data.query)) {
        eventbus.emit(HELP.eventType,
            { chatId: data.id, isInline: true }
        )
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