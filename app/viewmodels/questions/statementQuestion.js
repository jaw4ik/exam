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
            this.statements = [];

            this.activate = function () {
                var that = this;
                return Q.fcall(function () {
                    that.statements = _.map(question.statements, function (statement) {
                        var statementViewModel = {
                            id: statement.id,
                            text: statement.text,
                            selectedState: ko.observable(null)
                        };

                        statementViewModel.isTrueChecked = ko.computed(function () {
                            return statementViewModel.selectedState() == true;
                        });

                        statementViewModel.isFalseChecked = ko.computed(function () {
                            return statementViewModel.selectedState() == false;
                        });

                        return statementViewModel;
                    });

                    if (that.hasContent) {
                        return that.loadQuestionContent();
                    }
                });
            };

            this.setTrue = function (statement) {
                statement.selectedState(true);
            }

            this.setFalse = function (statement) {
                statement.selectedState(false);
            }

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
                var answeredStatements = _.chain(this.statements).map(function (statement) {
                    return { id: statement.id, state: statement.selectedState() };
                }).filter(function (statement) {
                    return !_.isNullOrUndefined(statement);
                }).value();

                var question = questionRepository.get(this.objectiveId, this.id);
                question.answer(answeredStatements);
            };

        };

        return ctor;

    }
);