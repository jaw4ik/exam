define(['eventManager', 'repositories/objectiveRepository'], function (eventManager, objectiveRepository) {
    "use strict";

    var ctor = function (spec) {
        var that = this;

        that.id = spec.id;
        that.objectiveId = spec.objectiveId;
        that.title = spec.title;
        that.hasContent = spec.hasContent;
        that.answers = spec.answers;
        that.correctAnswerId = spec.correctAnswerId;

        that.isAnswered = false;
        that.isCorrectAnswered = false;
        that.score = 0;

        that.answer = function (selectedAnswerId) {
            var answer = _.find(that.answers, function (a) {
                return a.id === selectedAnswerId;
            });

            if (!_.isNullOrUndefined(answer) && answer.id === that.correctAnswerId) {
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
                            image: item.image
                        };
                    }),
                    score: that.score,
                    selectedAnswersIds: [selectedAnswerId],
                    correctAnswersIds: [that.correctAnswerId]
                },
                objective: {
                    id: objective.id,
                    title: objective.title
                }
            };
            eventManager.answersSubmitted(eventData);
        };

    };

    return ctor;

});