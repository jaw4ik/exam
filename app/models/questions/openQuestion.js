define(['eventManager', 'repositories/objectiveRepository'], function (eventManager, objectiveRepository) {
    "use strict";

    var ctor = function (spec) {
        var that = this;

        that.id = spec.id;
        that.objectiveId = spec.objectiveId;
        that.title = spec.title;
        that.hasContent = spec.hasContent;

        that.isAnswered = false;
        that.isCorrectAnswered = false;
        that.score = 0;

        that.answer = function (answeredText) {
            that.isAnswered = true;
            that.isCorrectAnswered = !!answeredText;
            that.score = that.isCorrectAnswered ? 100 : 0;
            var objective = objectiveRepository.get(that.objectiveId);
            var eventData = {
                type: "other",
                question: {
                    id: that.id,
                    title: that.title,
                    answer: answeredText,
                },
                objective: {
                    id: objective.id,
                    title: objective.title
                }
            };
            eventManager.answersSubmitted(eventData);
        };

        that.resetProgress = function () {
            that.isAnswered = false;
            that.isCorrectAnswered = false;
            that.score = 0;
        };

    };

    return ctor;

});