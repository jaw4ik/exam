define(['eventManager', 'repositories/objectiveRepository'], function (eventManager, objectiveRepository) {
    "use strict";

    var ctor = function(spec) {
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

        that.answer = function (submittedAnswers) {
            var hasIncorrectAnswer = _.some(submittedAnswers, function (submittedAnswer) {
                return _.some(that.answers, function (answer) {
                    return submittedAnswer.groupId === answer.group && submittedAnswer.value !== answer.text;
                });
            });

            that.isAnswered = true;
            that.isCorrectAnswered = !hasIncorrectAnswer;
            that.score = hasIncorrectAnswer ? 0 : 100;

            var objective = objectiveRepository.get(that.objectiveId);

            var eventData =  {
                type: "fill-in",
                question: {
                    id: that.id,
                    title: that.title,
                    score: that.score,
                    enteredAnswersTexts: _.map(submittedAnswers, function (item) {
                        return item.value;
                    }),
                    correctAnswersTexts: _.map(that.answers, function (item) {
                        return item.text;
                    })
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