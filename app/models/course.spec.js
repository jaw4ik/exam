define(['models/course', 'eventDataBuilders/courseEventDataBuilder'], function (CourseModel, eventDataBuilder) {

    var eventManager = require('eventManager'),
        http = require('plugins/http');

    describe('model [course]', function () {

        beforeEach(function () {
            spyOn(eventManager, 'courseStarted');
            spyOn(eventManager, 'answersSubmitted');
        });

        it('should be defined', function () {
            expect(CourseModel).toBeDefined();
        });

        it('should return function', function () {
            expect(CourseModel).toBeFunction();
        });

        var course;
        var spec = {
            id: 'id',
            title: 'title',
            hasIntroductionContent: false,
            score: 0,
            objectives: [
                { score: 0, calculateScore: function () { } },
                { score: 100, calculateScore: function () { } }
            ]
        };

        beforeEach(function () {
            course = new CourseModel(spec);
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(course.id).toBeDefined();
            });

            it('should be equal to spec id', function () {
                expect(course.id).toBe(spec.id);
            });
        });

        describe('title:', function () {
            it('should be defined', function () {
                expect(course.title).toBeDefined();
            });

            it('should be equal to spec title', function () {
                expect(course.title).toBe(spec.title);
            });
        });

        describe('hasIntroductionContent:', function () {
            it('should be defined', function () {
                expect(course.hasIntroductionContent).toBeDefined();
            });

            it('should be equal to spec hasIntroductionContent', function () {
                expect(course.hasIntroductionContent).toBe(spec.hasIntroductionContent);
            });
        });
        
        describe('content:', function () {
            it('should be defined', function () {
                expect(course.content).toBeDefined();
            });

            it('should be null', function () {
                expect(course.content).toBe(null);
            });
        });

        describe('score:', function () {
            it('should be defined', function () {
                expect(course.score).toBeDefined();
            });

            it('should be equal to spec score', function () {
                expect(course.score).toBe(spec.score);
            });
        });

        describe('objectives:', function () {
            it('should be defined', function () {
                expect(course.objectives).toBeDefined();
            });

            it('should be equal to spec objectives', function () {
                expect(course.objectives).toBe(spec.objectives);
            });
        });

        describe('calculateScore:', function () {
            it('should be function', function () {
                expect(course.calculateScore).toBeFunction();
            });

            beforeEach(function () {
                spyOn(spec.objectives[0], 'calculateScore');
                spyOn(spec.objectives[1], 'calculateScore');
            });

            describe('when course has objectives', function () {

                it('should call calculate score for each objective', function () {
                    course.calculateScore();

                    expect(spec.objectives[0].calculateScore).toHaveBeenCalled();
                    expect(spec.objectives[0].calculateScore).toHaveBeenCalled();
                });

                it('should set score', function () {
                    course.score = 0;
                    course.calculateScore();
                    expect(course.score).toBe(50);
                });

                describe('when score value is fraction', function () {
                    it('should round score to floor', function () {
                        course.score = 0;
                        spec.objectives[0].score = 0;
                        spec.objectives[1].score = 67;

                        course.calculateScore();
                        expect(course.score).toBe(33);
                    });
                });

                describe('when course has incompleted objective', function () {
                    beforeEach(function () {
                        course.objectives[0].isCompleted = false;
                        course.objectives[1].isCompleted = true;
                    });

                    it('should set isCompleted to false', function () {
                        course.isCompleted = true;
                        course.calculateScore();
                        expect(course.isCompleted).toBe(false);
                    });
                });

                describe('when all course objectives are completed', function () {
                    beforeEach(function () {
                        course.objectives[0].isCompleted = true;
                        course.objectives[1].isCompleted = true;
                    });

                    it('should set isCompleted to true', function () {
                        course.isCompleted = false;
                        course.calculateScore();
                        expect(course.isCompleted).toBe(true);
                    });
                });
            });

            describe('when course has no objectives', function () {
                beforeEach(function () {
                    course.objectives = [];
                });

                it('should set score to zero', function () {
                    course.score = 100;
                    course.calculateScore();
                    expect(course.score).toBe(0);
                });

                it('should set isCompleted to false', function () {
                    course.isCompleted = true;
                    course.calculateScore();
                    expect(course.isCompleted).toBe(false);
                });

            });
        });

        describe('finish:', function () {
            var eventData = {};
            var obj = {
                callback: function () { }
            };
            beforeEach(function () {
                spyOn(eventDataBuilder, 'buildCourseFinishedEventData').andReturn(eventData);
                spyOn(eventManager, 'turnAllEventsOff');
                spyOn(eventManager, 'courseFinished').andCallFake(function (arg, callbackFunction) {
                    callbackFunction();
                });
            });

            it('should be function', function () {
                expect(course.finish).toBeFunction();
            });

            it('should call eventDataBuilder buildCourseFinishedEventData', function () {
                course.finish(obj.callback);
                expect(eventDataBuilder.buildCourseFinishedEventData).toHaveBeenCalled();
            });

            it('should call event manager course finished event', function () {
                course.finish(obj.callback);
                expect(eventManager.courseFinished).toHaveBeenCalled();
            });

            describe('when course finished', function () {
                it('should call event manager course turnAllEventsOff', function () {
                    course.finish(obj.callback);
                    expect(eventManager.turnAllEventsOff).toHaveBeenCalled();
                });

                it('should call callback function', function () {
                    spyOn(obj, 'callback');
                    course.finish(obj.callback);
                    expect(obj.callback).toHaveBeenCalled();
                });

            });
        });
        
        describe('start:', function () {
            it('should be function', function () {
                expect(course.start).toBeFunction();
            });

            it('should call event manager course started', function () {
                course.start();
                expect(eventManager.courseStarted).toHaveBeenCalled();
            });

            it('should set isAnswered to false', function () {
                course.isAnswered = true;
                course.start();
                expect(course.isAnswered).toBeFalsy();
            });
        });

        describe('submitAnswers:', function () {
            it('should be function', function () {
                expect(course.submitAnswers).toBeFunction();
            });

            describe('when questions is not an array', function () {
                it('should throw exception with \'Questions is not an array\'', function () {
                    var f = function () {
                        course.submitAnswers(null);
                    };
                    expect(f).toThrow('Questions is not an array');
                });
            });

            describe('when questions is an array', function () {
                var eventData = {};
                var answersData = [{
                    question: {
                        submitAnswer: function () { }
                    },
                    checkedAnswersIds: [0, 1]
                }];

                beforeEach(function () {
                    spyOn(eventDataBuilder, 'buildAnswersSubmittedEventData').andReturn(eventData);
                });

                it('should call submitAnswer method for each item', function () {
                    spyOn(answersData[0].question, 'submitAnswer');
                    course.submitAnswers(answersData);
                    expect(answersData[0].question.submitAnswer).toHaveBeenCalled();
                });

                it('should call event manager answers submitted', function () {
                    course.submitAnswers(answersData);
                    expect(eventManager.answersSubmitted).toHaveBeenCalled();
                });

                it('should call event data builder buildAnswersSubmittedEventData', function () {
                    course.submitAnswers(answersData);
                    expect(eventDataBuilder.buildAnswersSubmittedEventData).toHaveBeenCalled();
                });

                it('should call event manager answersSubmitted', function () {
                    course.submitAnswers(answersData);
                    expect(eventManager.answersSubmitted).toHaveBeenCalledWith(eventData);
                });

                it('should set isAnswered to true', function () {
                    course.isAnswered = false;
                    course.submitAnswers(answersData);
                    expect(course.isAnswered).toBeTruthy();
                });

            });
        });

        describe('allQuestions:', function () {
            it('should be defined', function () {
                expect(course.allQuestions).toBeDefined();
            });

            it('should return all questions', function () {
                var result = course.allQuestions;
                expect(result.length).toBe(2);
            });
        });
        
        describe('loadContent:', function () {
            var deferred = null;
            beforeEach(function () {
                deferred = Q.defer();
                spyOn(http, 'get').andReturn(deferred.promise);
            });

            it('should be function', function () {
                expect(course.loadContent).toBeFunction();
            });

            it('should return promise', function () {
                expect(course.loadContent({})).toBePromise();
            });

            describe('and when course does not have content', function () {
                beforeEach(function () {
                    course.hasIntroductionContent = false;
                });

                it('should resolve promise with null', function () {
                    var promise = course.loadContent();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolvedWith(null);
                    });
                });

                it('should not load content', function () {
                    var promise = course.loadContent();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(http.get).not.toHaveBeenCalled();
                    });
                });
            });

            describe('and when course has content', function () {
                beforeEach(function () {
                    course.hasIntroductionContent = true;
                });
                
                var content = 'content';

                it('should load content', function () {
                    var promise = course.loadContent();
                    deferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(http.get).toHaveBeenCalledWith('content/content.html');
                    });
                });

                describe('and when content loaded successfully', function () {

                    it('should set course content', function () {
                        var promise = course.loadContent();
                        deferred.resolve(content);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(course.content).toBe(content);
                        });
                    });

                    it('should resolve promise with content', function () {
                        var promise = course.loadContent();
                        deferred.resolve(content);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolvedWith(content);
                        });
                    });

                });

                describe('and when failed to load content', function () {
                    it('should set course content to null', function () {
                        var promise = course.loadContent();
                        deferred.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(course.content).toBe(null);
                        });
                    });

                    it('should resolve promise with null', function () {
                        var promise = course.loadContent();
                        deferred.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolvedWith(null);
                        });
                    });
                });

            });
        });

        describe('isCompleted:', function () {
            it('should be defined', function () {
                expect(course.isCompleted).toBeDefined();
            });

            it('should be false', function () {
                expect(course.isCompleted).toBe(false);
            });
        });
    });
});