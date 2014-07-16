define(function (require) {
    "use strict";

    var viewModel = require('viewmodels/questions'),
        router = require('plugins/router'),
        app = require('durandal/app'),
        eventManager = require('eventManager'),
        settings = require('configuration/settings'),
        courseRepository = require('repositories/courseRepository'),
        questionRepository = require('repositories/questionRepository');

    describe('viewModel [questions]', function () {

        var questions = [
            {
                id: 0,
                title: "Which of the following statements fits the WYSIWYG feature best?",
                hasContent: true,
                answers: [{
                    "id": 0,
                    "isCorrect": false,
                    "text": "The e-Learning in our platform will look exactly the same to the authors as it will be presented to the learners."
                }, {
                    "id": 1,
                    "isCorrect": true,
                    "text": "You always will see the direct effect of your actions in the editing screen of easygenerator."
                }],
                loadContent: function () { }
            },
            {
                id: 1,
                title: "Which of the following statements fits the WYSIWYG feature best?",
                hasContent: true,
                answers: [{
                    "id": 0,
                    "isCorrect": false,
                    "text": "The e-Learning in our platform will look exactly the same to the authors as it will be presented to the learners."
                }, {
                    "id": 1,
                    "isCorrect": true,
                    "text": "You always will see the direct effect of your actions in the editing screen of easygenerator."
                }],
                loadContent: function () { }
            }
        ];

        var course = {
            start: function () { },
            reset: function () { },
            submitAnswers: function () { },
            objectives: [{
                "id": 0,
                "title": "The learner is able to appreciate the easy and powerful features of easygenerator",
                "image": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSquMn3u84SWcQvKAbmrlUicfv2bYY3197JsNsilftexOQYce-Z",
                "questions": questions
            }]
        };

        beforeEach(function () {
            course.allQuestions = questions;
            spyOn(router, 'navigate');
        });

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('questions:', function () {

            it('should be observable', function () {
                expect(viewModel.questions).toBeObservable();
            });

        });

        describe('totalQuestionsCount:', function () {

            it('should be defined', function () {
                expect(viewModel.totalQuestionsCount).toBeDefined();
            });

        });

        describe('isFullyLoaded:', function () {

            it('should be observable', function () {
                expect(viewModel.isFullyLoaded).toBeObservable();
            });

        });

        describe('courseTitle:', function () {

            it('should be defined', function () {
                expect(viewModel.courseTitle).toBeDefined();
            });

        });

        describe('submit:', function () {

            beforeEach(function () {
                spyOn(courseRepository, 'get').andReturn(course);
                spyOn(course, 'submitAnswers');
            });

            it('should be function', function () {
                expect(viewModel.submit).toBeFunction();
            });

            it('should navigate to summary', function () {
                viewModel.submit();
                expect(router.navigate).toHaveBeenCalledWith('summary');
            });

            it('should call course submit answers', function () {
                viewModel.submit();
                expect(course.submitAnswers).toHaveBeenCalled();
            });
        });

        describe('loadQuestions:', function () {

            it('should be function', function () {
                expect(viewModel.loadQuestions).toBeFunction();
            });

            it('should return promise', function () {
                expect(viewModel.loadQuestions()).toBePromise();
            });

            describe('when all questions can be loaded at one step', function () {
                var defer;
                beforeEach(function () {
                    viewModel.questions([]);
                    settings.loadingQuestionsInStepCount = 5;
                    defer = Q.defer();

                    spyOn(courseRepository, 'get').andReturn(course);
                    spyOn(questionRepository, 'loadQuestionContentCollection').andReturn(defer.promise);

                    viewModel.activate();
                });

                it('should load question content', function () {
                    var promise = viewModel.loadQuestions();
                    defer.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(questionRepository.loadQuestionContentCollection).toHaveBeenCalled();
                    });
                });

                it('should set isFullyLoaded to true', function () {
                    var promise = viewModel.loadQuestions();
                    defer.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.isFullyLoaded()).toBeTruthy();
                    });
                });

                describe('and when content of question is loaded', function () {
                    it('should add question to questions collection', function () {
                        var promise = viewModel.loadQuestions();
                        defer.resolve(questions);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.questions().length).toBe(2);
                        });
                    });
                });

            });

            describe('when not all questions can be loaded at one step', function () {
                var defer;

                beforeEach(function () {
                    settings.loadingQuestionsInStepCount = 1;
                    defer = Q.defer();

                    spyOn(courseRepository, 'get').andReturn(course);
                    spyOn(questionRepository, 'loadQuestionContentCollection').andReturn(defer.promise);

                    viewModel.activate();
                });

                it('should load question content', function () {
                    var promise = viewModel.loadQuestions();
                    defer.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(questionRepository.loadQuestionContentCollection).toHaveBeenCalled();
                    });
                });

                it('should not change isFullyLoaded', function () {
                    viewModel.isFullyLoaded(false);
                    viewModel.totalQuestionsCount = 10;

                    var promise = viewModel.loadQuestions();
                    defer.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.isFullyLoaded()).toBeFalsy();
                    });
                });

                describe('and when content of question is loaded', function () {
                    it('should add one question to questions collection', function () {
                        viewModel.questions([]);
                        var promise = viewModel.loadQuestions();
                        defer.resolve([questions[0]]);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.questions().length).toBe(1);
                        });
                    });
                });

            });
        });

        describe('activate:', function () {

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when course is found', function () {

                beforeEach(function () {
                    spyOn(courseRepository, 'get').andReturn(course);
                });

                it('should set totalQuestionsCount', function () {
                    viewModel.totalQuestionsCount = 0;
                    viewModel.activate();
                    expect(viewModel.totalQuestionsCount).toBe(questions.length);
                });

                it('should set courseTitle', function () {
                    viewModel.courseTitle = '';
                    viewModel.activate();
                    expect(viewModel.courseTitle).toBe(course.title);
                });

            });

            describe('when course is not found', function () {
                beforeEach(function () {
                    spyOn(courseRepository, 'get').andReturn(null);
                });

                it('should navigate to 404', function () {
                    viewModel.activate();
                    expect(router.navigate).toHaveBeenCalledWith('404');
                });
            });

        });

        describe('canActivate:', function () {
            beforeEach(function () {
                spyOn(courseRepository, 'get').andReturn(course);
            });

            it('should be function', function () {
                expect(viewModel.canActivate).toBeFunction();
            });

            describe('when course is answered', function () {
                beforeEach(function () {
                    course.isAnswered = true;
                });

                it('should return false', function () {
                    var result = viewModel.canActivate();
                    expect(result).toBeFalsy();
                });
            });

            describe('when course is not answered', function () {
                beforeEach(function () {
                    course.isAnswered = false;
                });

                it('should return true', function () {
                    var result = viewModel.canActivate();
                    expect(result).toBeTruthy();
                });
            });
        });

    });
});