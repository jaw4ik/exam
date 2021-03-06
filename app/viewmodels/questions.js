﻿define(['durandal/app', 'plugins/router', 'eventManager', 'configuration/settings', 'repositories/questionRepository', 'repositories/courseRepository', 'constants',
    './questions/multipleSelectQuestion',
    './questions/singleSelectTextQuestion',
    './questions/fillInTheBlanksQuestion',
    './questions/dragAndDropTextQuestion',
    './questions/singleSelectImageQuestion',
    './questions/textMatchingQuestion',
    './questions/statementQuestion',
    './questions/hotspot',
    './questions/openQuestion',

    'models/questions/multipleSelectQuestion',
    'models/questions/singleSelectTextQuestion',
    'models/questions/fillInTheBlanksQuestion',
    'models/questions/dragAndDropTextQuestion',
    'models/questions/singleSelectImageQuestion',
    'models/questions/textMatchingQuestion',
    'models/questions/statementQuestion',
    'models/questions/hotspot',
    'models/questions/openQuestion'],
    function (app, router, eventManager, settings, questionRepository, courseRepository, constants,
        MultipleSelectQuestionViewModel,
        SingleSelectTextQuestionViewModel,
        FillInTheBlanksViewModel,
        DragAndDropTextQuestionViewModel,
        SingleSelectImageQuestionViewModel,
        TextMatchingQuestionViewModel,
        StatementQuestionViewModel,
        HotSpotViewModel,
        OpenQuestionViewModel,

        MultipleSelectQuestionModel,
        SingleSelectTextQuestionModel,
        FillInTheBlanksQuestionModel,
        DragAndDropTextQuestionModel,
        SingleSelectImageQuestionModel,
        TextMatchingQuestionModel,
        StatementQuestionModel,
        HotspotModel,
        OpenQuestionModel) {
        "use strict";

        var viewModel = {
            courseTitle: '',
            totalQuestionsCount: 0,
            loadedQuestionsCount: 0,
            questions: ko.observableArray([]),
            isFullyLoaded: ko.observable(true),

            canActivate: canActivate,
            activate: activate,
            loadQuestions: loadQuestions,
            submit: submit
        };

        return viewModel;

        function canActivate() {
            var course = courseRepository.get();
            return course.isAnswered() ? { redirect: 'summary' } : true;
        }

        function activate() {
            return Q.fcall(function () {
                var course = courseRepository.get();
                if (course == null) {
                    router.navigate('404');
                    return;
                }

                viewModel.courseTitle = course.title;
                viewModel.totalQuestionsCount = course.allQuestions.length;

                var mappedQuestions = _.chain(course.allQuestions).map(function (question, key) {
                    if (question instanceof MultipleSelectQuestionModel) {
                        return new MultipleSelectQuestionViewModel(question, key, course.allQuestions.length);
                    } else if (question instanceof SingleSelectTextQuestionModel) {
                        return new SingleSelectTextQuestionViewModel(question, key, course.allQuestions.length);
                    } else if (question instanceof FillInTheBlanksQuestionModel) {
                        return new FillInTheBlanksViewModel(question, key, course.allQuestions.length);
                    } else if (question instanceof DragAndDropTextQuestionModel) {
                        return new DragAndDropTextQuestionViewModel(question, key, course.allQuestions.length);
                    } else if (question instanceof SingleSelectImageQuestionModel) {
                        return new SingleSelectImageQuestionViewModel(question, key, course.allQuestions.length);
                    } else if (question instanceof TextMatchingQuestionModel) {
                        return new TextMatchingQuestionViewModel(question, key, course.allQuestions.length);
                    } else if (question instanceof StatementQuestionModel) {
                        return new StatementQuestionViewModel(question, key, course.allQuestions.length);
                    } else if (question instanceof HotspotModel) {
                        return new HotSpotViewModel(question, key, course.allQuestions.length);
                    } else if (question instanceof OpenQuestionModel) {
                        return new OpenQuestionViewModel(question, key, course.allQuestions.length);
                    }
                }).filter(function (question) {
                    return !_.isNullOrUndefined(question);
                }).value();

                viewModel.questions(mappedQuestions);
            });
        }

        function submit() {
            _.each(viewModel.questions(), function (question) {
                question.submit();
            });
            router.navigate('summary');
        }

        function loadQuestions() {
            var questionsToLoadContent = [],
                questionsToLoadCount = loadedQuestionsCount + settings.loadingQuestionsInStepCount;

            for (var i = loadedQuestionsCount; i < questionsToLoadCount; i++) {
                if (i > allQuestions.length - 1) {
                    isFullyLoaded(true);
                    break;
                }

                questionsToLoadContent.push(allQuestions[i]);
                loadedQuestionsCount++;
            }

            return questionRepository.loadQuestionContentCollection(questionsToLoadContent).then(function (questions) {
                var mappedQuestions = _.chain(questions).map(function (question, key) {
                    if (question instanceof MultipleSelectQuestionModel) {
                        return new MultipleSelectQuestionViewModel(question, key, course.allQuestions.length);
                    } else if (question instanceof SingleSelectTextQuestionModel) {
                        return new SingleSelectTextQuestionViewModel(question, key, course.allQuestions.length);
                    } else if (question instanceof FillInTheBlanksQuestionModel) {
                        return new FillInTheBlanksViewModel(question, key, course.allQuestions.length);
                    } else if (question instanceof DragAndDropTextQuestionModel) {
                        return new DragAndDropTextQuestionViewModel(question, key, course.allQuestions.length);
                    } else if (question instanceof SingleSelectImageQuestionModel) {
                        return new SingleSelectImageQuestionViewModel(question, key, course.allQuestions.length);
                    } else if (question instanceof TextMatchingQuestionModel) {
                        return new TextMatchingQuestionViewModel(question, key, course.allQuestions.length);
                    } else if (question instanceof StatementQuestionModel) {
                        return new StatementQuestionViewModel(question, key, course.allQuestions.length);
                    } else if (question instanceof HotspotModel) {
                        return new HotSpotViewModel(question, key, course.allQuestions.length);
                    }
                }).filter(function (question) {
                    return !_.isNullOrUndefined(question);
                }).value();

                viewModel.questions.push(mappedQuestions);
            });
        }
    }
);