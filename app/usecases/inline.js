exports.registerListener = function (bot, useCasesWithInlineSupport, stationUseCase, contextResolver) {
    bot.on("inline_query", function (data) {
        for (index in useCasesWithInlineSupport) {
            const usecase = useCasesWithInlineSupport[index]
            if (usecase.commandRegex.test(data.query)) {
                usecase.handleInline(bot, data.id)
                return;
            }
        }
        if (stationUseCase.commandRegex.test(data.query)) {
            stationUseCase.handleInline(bot, data, contextResolver)
        }
    });
}
