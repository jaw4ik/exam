define(['models/course', 'models/objective', 'models/answer', 'models/answerGroup',

    'models/questions/multipleSelectQuestion',
    'models/questions/singleSelectTextQuestion',
    'models/questions/fillInTheBlanksQuestion',
    'models/questions/dragAndDropTextQuestion',
    'models/questions/singleSelectImageQuestion',
    'models/singleSelectImageAnswer',
    'models/questions/textMatchingQuestion',
    'models/questions/statementQuestion',
    'models/questions/hotspot',
    'constants'],
    function (Course,
        Objective,
        Answer,
        AnswerGroup,
        MultipleSelectQuestion,
        SingleSelectTextQuestion,
        FillInTheBlanksQuestion,
        DragAndDropTextQuestion,
        SingleSelectImageQuestion,
        SingleSelectImageAnswer,
        TextMatchingQuestion,
        StatementQuestion,
        Hotspot,
        constants) {
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
                url: 'content/data.js',
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
                            .filter(function (item) {
                                return !_.isNullOrUndefined(item.questions) && item.questions.length > 0;
                            })
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
                } else if (question.type == constants.question.types.singleSelectImage) {
                    return mapSingleSelectImageQuestion(question, objective.id);
                } else if (question.type == constants.question.types.textMatching) {
                    return mapTextMatchingQuestion(question, objective.id);
                } else if (question.type == constants.question.types.statement) {
                    return mapStatementQuestion(question, objective.id);
                } else if (question.type == constants.question.types.hotspot) {
                    return mapHotspotQuestion(question, objective.id);
                }
            }).filter(function (question) {
                return !_.isNullOrUndefined(question);
            }).value();

        }

        function mapHotspotQuestion(question, objectiveId) {
            return new Hotspot({
                id: question.id,
                objectiveId: objectiveId,
                title: question.title,
                spots: question.spots,
                isMultiple: question.isMultiple,
                background: question.background,
                score: 0,
                hasContent: question.hasContent
                });
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
                answerGroups: mapAnswerGroups(question.answerGroups),
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

        function mapSingleSelectImageQuestion(question, objectiveId) {
            return new SingleSelectImageQuestion({
                id: question.id,
                objectiveId: objectiveId,
                title: question.title,
                answers: mapSingleSelectImageAnswers(question.answers),
                score: 0,
                hasContent: question.hasContent,
                correctAnswerId: question.correctAnswerId
            });
        }

        function mapTextMatchingQuestion(question, objectiveId) {
            return new TextMatchingQuestion({
                id: question.id,
                objectiveId: objectiveId,
                title: question.title,
                answers: question.answers,
                score: 0,
                hasContent: question.hasContent,
                correctAnswerId: question.correctAnswerId
            });
        }

        function mapStatementQuestion(question, objectiveId) {
            return new StatementQuestion({
                id: question.id,
                objectiveId: objectiveId,
                title: question.title,
                statements: question.answers,
                score: 0,
                hasContent: question.hasContent
            });
        }

        function mapAnswers(answers) {
            return _.map(answers, function (answer) {
                return new Answer({
                    id: answer.id,
                    isCorrect: answer.isCorrect,
                    text: answer.text
                });
            });
        }

        function mapAnswerGroups(answerGroups) {
            return _.map(answerGroups, function (answerGroup) {
                return new AnswerGroup({
                    id: answerGroup.id,
                    answers: mapAnswers(answerGroup.answers)
                });
            });
        }

        function mapSingleSelectImageAnswers(answers) {
            return _.map(answers, function (answer) {
                return new SingleSelectImageAnswer({
                    id: answer.id,
                    image: answer.image
                });
            });
        }

    }
);