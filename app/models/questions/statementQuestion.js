define(['eventManager', 'repositories/objectiveRepository'], function (eventManager, objectiveRepository) {
    "use strict";

    var ctor = function (spec) {
        var that = this;

        that.id = spec.id;
        that.objectiveId = spec.objectiveId;
        that.title = spec.title;
        that.hasContent = spec.hasContent;
        that.statements = _.shuffle(spec.statements);
        that.learningContents = spec.learningContents;

        that.isAnswered = false;
        that.isCorrectAnswered = false;
        that.score = 0;

        that.answer = function (answeredStatements) {
            that.isCorrectAnswered = _.every(answeredStatements, function (answered) {
                var statement = _.find(that.statements, function (item) {
                    return item.id == answered.id;
                });

                return !_.isNullOrUndefined(answered.state) && answered.state == statement.isCorrect;
            });

            that.score = that.isCorrectAnswered ? 100 : 0;
            that.isAnswered = true;

            var objective = objectiveRepository.get(that.objectiveId);
            var eventData = {
                type: "choice",
                question: {
                    id: that.id,
                    title: that.title,
                    answers: _.map(that.statements, function (item) {
                        return {
                            id: item.id,
                            text: item.text
                        };
                    }),
                    score: that.score,
                    selectedAnswersIds: _.chain(answeredStatements).filter(function (statement) {
                        return !_.isNullOrUndefined(statement.state);
                    }).map(function (statement) {
                        return statement.id + '[.]' + statement.state;
                    }).value(),
                    correctAnswersIds: _.map(that.statements, function (item) {
                        return item.id + '[.]' + item.isCorrect;
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