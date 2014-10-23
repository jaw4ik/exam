define(['eventManager', 'repositories/objectiveRepository'], function (eventManager, objectiveRepository) {
    "use strict";

    var ctor = function (spec) {
        var that = this;

        that.id = spec.id;
        that.objectiveId = spec.objectiveId;
        that.title = spec.title;

        that.background = spec.background;
        that.dropspots = spec.dropspots;
        that.learningContents = spec.learningContents;
        that.score = spec.score;
        that.isAnswered = false;
        that.isCorrectAnswered = false;

        that.answer = function (answers) {
            var correct = 0;

            _.each(answers, function (answer) {
                if (_.find(that.dropspots, function (dropspot) {
                    return dropspot.id === answer.id && dropspot.x === answer.x && dropspot.y === answer.y;
                })) {
                    correct++;
                }
            });

            that.isAnswered = true;
            that.isCorrectAnswered = correct === that.dropspots.length ? 100 : 0;
            that.score = correct === that.dropspots.length ? 100 : 0;

            var objective = objectiveRepository.get(that.objectiveId);
            var eventData =  {
                type: "dragAndDrop",
                question: {
                    id: that.id,
                    title: that.title,
                    score: that.score,
                    enteredAnswersTexts: _.map(answers, function (item) {
                        return '(' + item.x + ',' + item.y + ')';
                    }),
                    correctAnswersTexts: _.map(that.dropspots, function (item) {
                        return '(' + item.x + ',' + item.y + ')';
                    }),
                    selectedAnswersIds: _.map(answers, function (item) {
                        return item.id;
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