define(['context', 'guard', 'plugins/http', 'configuration/settings'], function (context, guard, http, settings) {

    return {
        get: get,
        loadQuestionContent: loadQuestionContent,
        loadQuestionContentCollection: loadQuestionContentCollection
    };

    function get(objectiveId, questionId) {
        guard.throwIfNotString(objectiveId, 'Objective id is not a string');
        guard.throwIfNotString(questionId, 'Question id is not a string');
        var objective = _.find(context.course.objectives, function (item) {
            return item.id == objectiveId;
        });

        if (!objective) {
            return null;
        }

        var question = _.find(objective.questions, function (item) {
            return item.id == questionId;
        });

        if (!question) {
            return null;
        }

        return question;
    }

    function loadQuestionContent(objectiveId, questionId) {
        return Q.fcall(function () {
            guard.throwIfNotString(objectiveId, 'Objective id is not a string');
            guard.throwIfNotString(questionId, 'Question id is not a string');

            var question = get(objectiveId, questionId);
            guard.throwIfNotAnObject(question, 'Question is not an object');

            if (!question.hasContent) {
                return question;
            }

            var contentUrl = 'content/' + question.objectiveId + '/' + question.id + '/content.html';
            return http.get(contentUrl)
                .then(function (response) {
                    question.content = response;
                    return question;
                })
                .fail(function () {
                    question.content = settings.questionContentNonExistError;
                    return question;
                });
        });
    }

    function loadQuestionContentCollection(questions) {
        return Q.fcall(function () {
            guard.throwIfNotArray(questions, 'Questions is not an array');

            var promises = [];
            _.each(questions, function (question) {
                promises.push(loadQuestionContent(question.objectiveId, question.id));
            });

            return Q.allSettled(promises).then(function (results) {
                return _.map(results, function (item) {
                    return item.value;
                });
            });
        });
    }

})