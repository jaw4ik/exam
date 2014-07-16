define(['eventManager', 'repositories/objectiveRepository'], function (eventManager, objectiveRepository) {
    "use strict";

    var ctor = function (spec) {
        var that = this;

        that.id = spec.id;
        that.objectiveId = spec.objectiveId;
        that.title = spec.title;
        that.hasContent = spec.hasContent;
        that.answers = spec.answers;
        that.learningContents = spec.learningContents;

        that.isAnswered = false;
        that.isCorrectAnswered = false;
        that.score = 0;

        that.answer = function (selectedAnswerId) {
            var answer = _.find(that.answers, function (a) {
                return a.id === selectedAnswerId;
            });

            if (!_.isNullOrUndefined(answer) && answer.isCorrect) {
                that.score = 100;
                that.isCorrectAnswered = true;
            } else {
                that.score = 0;
            }

            that.isAnswered = true;

            var objective = objectiveRepository.get(that.objectiveId);
            var eventData = {
                type: "choice",
                question: {
                    id: that.id,
                    title: that.title,
                    answers: _.map(that.answers, function (item) {
                        return {
                            id: item.id,
                            text: item.text
                        };
                    }),
                    score: that.score,
                    selectedAnswersIds: [selectedAnswerId],
                    correctAnswersIds: _.chain(that.answers).filter(function (item) {
                        return item.isCorrect;
                    }).map(function (item) {
                        return item.id;
                    }).value(),
                    correctAnswersTexts: _.chain(that.answers).filter(function (item) {
                        return item.isCorrect;
                    }).map(function (item) {
                        return item.text;
                    }).value(),
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