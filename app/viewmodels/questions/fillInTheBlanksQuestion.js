define(['plugins/http', 'eventManager', 'repositories/questionRepository', 'plugins/router'], function (http, eventManager, questionRepository, router) {
    "use strict";

    var ctor = function (question, index, questionsCount) {
        var that = this;

        that.id = question.id;
        that.objectiveId = question.objectiveId;
        that.index = index;
        that.questionsCount = questionsCount;
        that.title = question.title;
        that.hasContent = question.hasContent;
        that.content = '';
        that.answerGroups = [];

        that.activate = function () {
            return Q.fcall(function () {
                that.answerGroups = _.map(question.answerGroups, function (answerGroup) {
                    return {
                        id: answerGroup.id,
                        answers: answerGroup.answers,
                    };
                });

                if (that.hasContent) {
                    return that.loadQuestionContent();
                }
            });
        };

        that.loadQuestionContent = function () {
            var contentUrl = 'content/' + that.objectiveId + '/' + that.id + '/content.html';
            return Q(http.get(contentUrl)).then(function (response) {
                that.content = response;
            }).fail(function () {
                that.content = settings.questionContentNonExistError;
            });
        };

        that.submit = function () {
            var currentQuestion = questionRepository.get(that.objectiveId, that.id);
            currentQuestion.answer(that.answerGroups);
        };

    };

    return ctor;

});