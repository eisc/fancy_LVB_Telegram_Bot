process.env['NTBA_FIX_319'] = 1

const startUseCase = require('./usecases/start')
const helpUseCase = require('./usecases/help')
const contextUseCase = require('./usecases/context')
const planUseCase = require('./usecases/plan')
const quickselectAddUseCase = require('./usecases/quickselect/addition')
const quickselectResetUseCase = require('./usecases/quickselect/removal')
const locationUseCase = require('./usecases/location')
const stationUseCase = require('./usecases/station')
const inlineUseCase = require('./usecases/inline')

const useCases = [ startUseCase, helpUseCase, contextUseCase, planUseCase,
    quickselectResetUseCase, locationUseCase ]
const useCasesWithContext = [ quickselectAddUseCase, stationUseCase ]
const useCasesWithInlineSupport = [ startUseCase, helpUseCase,
    contextUseCase, planUseCase ]

const bot = require('./helper/bot').createBot()
useCases.forEach(useCase => useCase.registerListener(bot))
useCasesWithContext.forEach(useCase => useCase.registerListener(bot, contextUseCase.isInCurrentContext))
inlineUseCase.registerListener(bot, useCasesWithInlineSupport, stationUseCase, contextUseCase.isInCurrentContext)