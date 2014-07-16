define(['plugins/router', 'plugins/http', 'configuration/settings', 'repositories/questionRepository', 'eventManager'],
    function (router, http, settings, questionRepository, eventManager) {
        "use strict";

        var ctor = function (question, index, questionsCount) {
            this.id = question.id;
            this.objectiveId = question.objectiveId;
            this.index = index;
            this.questionsCount = questionsCount;
            this.title = question.title;
            this.hasContent = question.hasContent;
            this.content = '';
            this.answers = [];

            this.activate = function () {
                var that = this;
                return Q.fcall(function () {
                    that.answers = _.map(question.answers, function (answer) {
                        return {
                            id: answer.id,
                            text: answer.text,
                            isChecked: ko.observable(false),
                            toggleCheck: function () {
                                this.isChecked(!this.isChecked());
                            }
                        };
                    });

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
                var selectedAnswers = _.chain(this.answers).map(function (answer) {
                    if (answer.isChecked()) {
                        return answer.id;
                    }
                }).filter(function (answer) {
                    return !_.isNullOrUndefined(answer);
                }).value();

                var question = questionRepository.get(this.objectiveId, this.id);
                question.answer(selectedAnswers);
            };

        };

        return ctor;

    }
);