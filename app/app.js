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
const { handleCommandStart, handleCommandHelp } = require('./handler/general')
const { handleContext, isInCurrentContext } = require('./handler/context')
const { handleCommandPlan } = require('./handler/plan')
const { handleCommandAdd } = require('./handler/stationadd')
const { handleCommandReset } = require('./handler/reset')
const { handleCommandLocation } = require('./handler/location')
const { handlePotentialStation } = require('./handler/station')

const bot = require('./helper/bot').createBot()

bot.onText(/\/context(\s*)(.*)/, (msg, match) => handleContext(bot, msg, match))  //bot-object only in handler-function yet
bot.onText(/\/start/, (msg) => handleCommandStart(bot, msg)) //bot-object only in handler-function yet
bot.onText(/\/help/, (msg) => handleCommandHelp(bot, msg))   //bot-object only in handler-function yet
bot.onText(/\/plan/, (msg, match) => handleCommandPlan(bot, msg, match)) //bot-object only in one more function 'handlePlanSelection', seems o.k. there,
                                                                        //'handlePlanSelection' is no handler-function -> rename it
bot.onText(/\/add(\s*)(.*)/, (msg, match) => handleCommandAdd(bot, msg, match, isInCurrentContext)) //bot-object still in other function handleMatchingStation
                    //1) rename handleMatchingStation, because it is no handler-function
                    //2) try to remove bot-object from this funktion, if possible
                    //bot-obj is not given further as argument
bot.onText(/\/reset(\s*)(.*)/, (msg, match) => handleCommandReset(bot, msg, match))  //ToDo: bot-object-argument still in multiple functions
bot.on('location', (msg) => handleCommandLocation(bot, msg))  //ToDo: bot-object still in multiple functions, seems difficult to separate
                                                            //more Domain-Knowledge needed to decide how to separate

const noKeyword = /^((?!(\/start|\/help|\/plan|\/add|\/context|\/reset)).)*$/
bot.onText(noKeyword, (msg, match) => handlePotentialStation(bot, msg, match, isInCurrentContext))  //ToDo: bot-object still in multiple functions, seems difficult to separate
                                                                                                    //more Domain-Knowledge needed to decide how to separate