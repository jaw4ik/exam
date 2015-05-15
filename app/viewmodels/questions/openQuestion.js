define(['knockout', 'Q', 'repositories/questionRepository', 'plugins/http', 'configuration/settings'],
    function (ko, Q, questionRepository, http, settings) {
    "use strict";

    var ctor = function (question, index, questionsCount) {
        this.id = question.id;
        this.objectiveId = question.objectiveId;
        this.index = index;
        this.questionsCount = questionsCount;
        this.title = question.title;
        this.hasContent = question.hasContent;
        this.content = '';
        this.answeredText = ko.observable('');

        this.activate = function () {
            var that = this;
            return Q.fcall(function () {
                if (that.hasContent) {
                    return that.loadQuestionContent();
                }
            });
        };

        this.loadQuestionContent = function () {
            var that = this;

            var contentUrl = 'content/' + this.objectiveId + '/' + this.id + '/content.html';
            return Q(http.get(contentUrl)).then(function (response) {
                that.content = response;
            }).fail(function () {
                that.content = settings.questionContentNonExistError;
            });
        };

        this.submit = function () {
            var question = questionRepository.get(this.objectiveId, this.id);
            question.answer(this.answeredText());
        };
    }
    return ctor;
});