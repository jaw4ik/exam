define(['models/course', 'models/objective', 'models/answer', 'models/questions/multipleSelectQuestion',
    'models/questions/singleSelectTextQuestion', 'models/questions/fillInTheBlanksQuestion', 'models/questions/dragAndDropTextQuestion', 'constants'],
    function (Course, Objective, Answer,  MultipleSelectQuestion, SingleSelectTextQuestion, FillInTheBlanksQuestion, DragAndDropTextQuestion, constants) {
        "use strict";

        var context = {
            course: null,
            courseId: '',
            objectives: [],
            title: '',

            initialize: initialize
        };

        return context;

        function initialize() {
            return $.ajax({
                url: 'content/data.js?v=' + Math.random(),
                contentType: 'application/json',
                dataType: 'json'
            }).then(function (response) {
                context.course = mapCourse(response);
            });
        };

        function mapCourse(course) {
            context.courseId = course.id;
            context.title = course.title;

            return new Course({
                id: course.id,
                title: course.title,
                hasIntroductionContent: course.hasIntroductionContent,
                objectives: mapObjectives(course.objectives)
            });
        }

        function mapObjectives(objectives) {
            return _.map(objectives, function (objective) {
                return new Objective({
                    id: objective.id,
                    title: objective.title,
                    image: objective.image,
                    questions: mapQuestions(objective)
                });
            });
        }

        function mapQuestions(objective) {
            return _.chain(objective.questions).map(function (question) {
                if (question.type == constants.question.types.multipleSelect) {
                    return mapMultipleSelectQuestion(question, objective.id);
                } else if (question.type == constants.question.types.singleSelectText) {
                    return mapSingleSelectTextQuestion(question, objective.id);
                } else if (question.type == constants.question.types.fillInTheBlanks) {
                    return mapFillInTheBlanksQuestion(question, objective.id);
                } else if (question.type == constants.question.types.dragAndDropText) {
                    return mapDragAndDropTextQuestion(question, objective.id);
                }
            }).filter(function (question) {
                return !_.isNullOrUndefined(question);
            }).value();

        }

        function mapDragAndDropTextQuestion(question, objectiveId) {
            return new DragAndDropTextQuestion({
                id: question.id,
                objectiveId: objectiveId,
                title: question.title,
                dropspots: question.dropspots,
                background: question.background,
                score: 0
            });
        }

        function mapFillInTheBlanksQuestion(question, objectiveId) {
            return new FillInTheBlanksQuestion({
                id: question.id,
                objectiveId: objectiveId,
                title: question.title,
                answers: mapAnswers(question.answers),
                score: 0,
                hasContent: question.hasContent
            });
        }

        function mapMultipleSelectQuestion(question, objectiveId) {
            return new MultipleSelectQuestion({
                id: question.id,
                objectiveId: objectiveId,
                title: question.title,
                answers: mapAnswers(question.answers),
                score: 0,
                hasContent: question.hasContent
            });
        }

        function mapSingleSelectTextQuestion(question, objectiveId) {
            return new SingleSelectTextQuestion({
                id: question.id,
                objectiveId: objectiveId,
                title: question.title,
                answers: mapAnswers(question.answers),
                score: 0,
                hasContent: question.hasContent
            });
        }

        function mapAnswers(answers) {
            return _.map(answers, function (answer) {
                return new Answer({
                    id: answer.id,
                    isCorrect: answer.isCorrect,
                    text: answer.text,
                    group: answer.group
                });
            });
        }

    }
);