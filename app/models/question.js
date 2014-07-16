define(['eventManager', 'guard', 'plugins/http', 'configuration/settings'],
    function (eventManager, guard, http, settings) {

        var model = function (spec) {
            return {
                id: spec.id,
                objectiveId: spec.objectiveId,
                title: spec.title,
                hasContent: spec.hasContent,
                score: spec.score,
                answers: spec.answers,
                isAnswered: false,
                isCorrectAnswered: false,
                submitAnswer: submitAnswer,
                loadContent: loadContent
            };
        };

        var submitAnswer = function (checkedAnswerIds) {
            guard.throwIfNotArray(checkedAnswerIds, 'Checked answer ids is not an array');

            _.each(this.answers, function (answer) {
                answer.isChecked = _.contains(checkedAnswerIds, answer.id);
            });

            this.score = calculateScore(this.answers);
            this.isAnswered = true;
            this.isCorrectAnswered = this.score == 100;
        };

        var loadContent = function () {
            var that = this;
            return Q.fcall(function () {
                if (!that.hasContent) {
                    return;
                }

                var contentUrl = 'content/' + that.objectiveId + '/' + that.id + '/content.html';
                return http.get(contentUrl)
                    .then(function (response) {
                        that.content = response;
                    })
                    .fail(function () {
                        that.content = settings.questionContentNonExistError;
                    });
            });
        };

        var calculateScore = function (answers) {
            var hasIncorrectCheckedAnswer = _.some(answers, function (answer) {
                return answer.isChecked != answer.isCorrect;
            });

            return hasIncorrectCheckedAnswer ? 0 : 100;
        };

        return model;
    });