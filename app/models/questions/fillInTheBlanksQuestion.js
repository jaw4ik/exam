define(['eventManager', 'repositories/objectiveRepository'], function (eventManager, objectiveRepository) {
    "use strict";

    var ctor = function(spec) {
        var that = this;

        that.id = spec.id;
        that.objectiveId = spec.objectiveId;
        that.title = spec.title;
        that.hasContent = spec.hasContent;
        that.answerGroups = spec.answerGroups;
        that.learningContents = spec.learningContents;

        that.isAnswered = false;
        that.isCorrectAnswered = false;
        that.score = 0;

        that.answer = function (submittedAnswerGroups) {
            var hasIncorrectAnswer = _.some(submittedAnswerGroups, function (submittedAnswerGroup) {
                return _.some(that.answerGroups, function (answerGroup) {
                    return submittedAnswerGroup.id === answerGroup.id && !answerGroup.checkIsCorrect(submittedAnswerGroup.value);
                });
            });

            that.isAnswered = true;
            that.isCorrectAnswered = !hasIncorrectAnswer;
            that.score = hasIncorrectAnswer ? 0 : 100;
            var objective = objectiveRepository.get(that.objectiveId);
            var eventData = {
                type: "fill-in",
                question: {
                    id: that.id,
                    title: that.title,
                    score: that.score,
                    enteredAnswersTexts: _.map(submittedAnswerGroups, function (answerGroup) {
                        return answerGroup.value;
                    }),
                    correctAnswersTexts: _.flatten(_.map(that.answerGroups, function(answerGroup) {
                        return answerGroup.getCorrectText();
                    })),
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