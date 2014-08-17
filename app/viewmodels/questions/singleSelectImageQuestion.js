define(['knockout', 'plugins/router', 'plugins/http', 'configuration/settings'],
    function (knockout, router, http, settings) {
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

            that.selectedOption = ko.observable();

            that.activate = function () {
                return Q.fcall(function () {
                    that.answers = _.map(question.answers, function (answer) {
                        return {
                            id: answer.id,
                            image: answer.image
                        };
                    });

                    if (that.hasContent) {
                        return that.loadQuestionContent();
                    }
                });
            };

            that.selectOption = function (item) {
                that.selectedOption(item);
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
                var option = ko.utils.unwrapObservable(that.selectedOption);
                question.answer(option ? option.id : undefined);
            };
        };

        return ctor;

    }
);