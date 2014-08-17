define(['plugins/router', 'plugins/http', 'configuration/settings', 'repositories/questionRepository'],
    function (router, http, settings, questionRepository) {
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
                            image: answer.image,
                            isChecked: ko.observable(question.selectedAnswer === answer.id)
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
                that.saveSelectedAnswer();
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
                var asnwerId = getSelectedAnswer();
                var question = questionRepository.get(that.objectiveId, that.id);
                question.answer(asnwerId);
            };

            function getSelectedAnswer() {
                var selectedAnswer = _.find(that.answers, function (answer) {
                    return answer.isChecked();
                });

                return !_.isNullOrUndefined(selectedAnswer) && !_.isNullOrUndefined(selectedAnswer.id) ? selectedAnswer.id : '';
            }

        };

        return ctor;

    }
);