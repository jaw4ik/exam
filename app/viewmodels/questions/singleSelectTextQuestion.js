define(['plugins/router', 'plugins/http', 'configuration/settings', 'repositories/questionRepository', 'eventManager'],
    function (router, http, settings, questionRepository, eventManager) {
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
            that.answers = [];

            that.activate = function () {
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

            that.checkItem = function (item) {
                _.each(that.answers, function (answer) {
                    answer.isChecked(false);
                });
                item.isChecked(true);
            }

            that.loadQuestionContent = function () {
                var contentUrl = 'content/' + that.objectiveId + '/' + that.id + '/content.html';
                return Q(http.get(contentUrl)).then(function (response) {
                    that.content = response;
                }).fail(function () {
                    that.content = settings.questionContentNonExistError;
                });
            };

            that.submit = function () {
                var selectedAnswer = _.find(that.answers, function(answer) {
                    return answer.isChecked();
                });

                var asnwerId = !_.isNullOrUndefined(selectedAnswer) && !_.isNullOrUndefined(selectedAnswer.id) ? selectedAnswer.id : '';

                var question = questionRepository.get(that.objectiveId, that.id);
                question.answer(asnwerId);
            };

        };

        return ctor;

    }
);