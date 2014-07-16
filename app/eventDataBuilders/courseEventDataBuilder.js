define(['guard', 'repositories/objectiveRepository'], function (guard, objectiveRepository) {

    var buildCourseFinishedEventData = function (course) {
        guard.throwIfNotAnObject(course, 'Course is not an object');

        return {
            result: course.score / 100,
            isCompleted: course.isCompleted,
            objectives: _.map(course.objectives, function (objective) {
                return {
                    id: objective.id,
                    title: objective.title,
                    score: objective.score
                };
            })
        };
    };

    var buildAnswersSubmittedEventData = function (course) {
        guard.throwIfNotAnObject(course, 'Course is not an object');

        return _.map(course.allQuestions, function (question) {
            return buildAnswersSubmittedDataForQuestion(question);
        });
    };

    var buildAnswersSubmittedDataForQuestion = function (question) {
        var objective = objectiveRepository.get(question.objectiveId);
        guard.throwIfNotAnObject(objective, 'Objective is not found');

        return {
            question: {
                id: question.id,
                title: question.title,
                answers: _.map(question.answers, function (item) {
                    return {
                        id: item.id,
                        text: item.text
                    };
                }),
                score: question.score,
                selectedAnswersIds: getItemsIds(question.answers, function (item) {
                    return item.isChecked;
                }),
                correctAnswersIds: getItemsIds(question.answers, function (item) {
                    return item.isCorrect;
                })
            },
            objective: {
                id: objective.id,
                title: objective.title
            }
        };
    };

    var getItemsIds = function (items, filter) {
        return _.chain(items)
           .filter(function (item) {
               return filter(item);
           })
           .map(function (item) {
               return item.id;
           }).value();
    };

    return {
        buildCourseFinishedEventData: buildCourseFinishedEventData,
        buildAnswersSubmittedEventData: buildAnswersSubmittedEventData
    };
});