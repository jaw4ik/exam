define(function (require) {
    "use strict";

    var
        viewModel = require('viewmodels/summary'),
        router = require('plugins/router'),
        windowOperations = require('windowOperations'),
        courseSettings = require('modules/courseSettings'),
        repository = require('repositories/courseRepository');

    describe('viewModel [summary]', function () {

        var course = {
            calculateScore: function () { },
            finish: function () { },
            objectives: [{
                id: 'id',
                title: 'titile',
                score: 75
            }]
        };

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('overallScore:', function () {
            it('should be defined', function () {
                expect(viewModel.overallScore).toBeDefined();
            });
        });

        describe('masteryScore:', function () {
            it('should be defined', function () {
                expect(viewModel.masteryScore).toBeDefined();
            });
        });

        describe('canActivate:', function () {
            beforeEach(function () {
                spyOn(repository, 'get').andReturn(course);
            });

            it('should be function', function () {
                expect(viewModel.canActivate).toBeFunction();
            });

            describe('when course is answered', function () {
                beforeEach(function () {
                    course.isAnswered = true;
                });

                it('should return true', function () {
                    var result = viewModel.canActivate();
                    expect(result).toBeTruthy();
                });
            });

            describe('when course is not answered', function () {
                beforeEach(function () {
                    course.isAnswered = false;
                });

                it('should return redirect to root', function () {
                    var result = viewModel.canActivate();
                    expect(result).toEqual({ redirect: '#' });
                });
            });
        });

        describe('activate:', function () {

            beforeEach(function () {
                spyOn(router, 'navigate');
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            describe('when course is not an object', function () {

                beforeEach(function () {
                    spyOn(repository, 'get').andReturn(null);
                });

                it('should navigate to 404', function () {
                    viewModel.activate();
                    expect(router.navigate).toHaveBeenCalledWith('404');
                });
            });

            describe('when course is an object', function () {

                beforeEach(function () {
                    spyOn(repository, 'get').andReturn(course);
                });

                it('should call course calculate score', function () {
                    spyOn(course, 'calculateScore');

                    viewModel.activate();
                    expect(course.calculateScore).toHaveBeenCalled();
                });

                it('should set course overallScore', function () {
                    viewModel.overallScore = 0;
                    course.score = 55;

                    viewModel.activate();
                    expect(viewModel.overallScore).toBe(55);
                });

                it('should set masteryScore', function () {
                    viewModel.masteryScore = 0;
                    courseSettings.masteryScore = { score: 55 };

                    viewModel.activate();
                    expect(viewModel.masteryScore).toBe(55);
                });

                it('should map objectives collection', function () {
                    viewModel.objectives = [];

                    viewModel.activate();
                    expect(viewModel.objectives.length).toBe(1);
                    expect(viewModel.objectives[0].id).toBe(course.objectives[0].id);
                    expect(viewModel.objectives[0].title).toBe(course.objectives[0].title);
                    expect(viewModel.objectives[0].score).toBe(course.objectives[0].score);
                });
            });

        });
        
        describe('finish:', function () {

            beforeEach(function () {
                spyOn(repository, 'get').andReturn(course);
            });

            it('should be function', function () {
                expect(viewModel.finish).toBeFunction();
            });

            it('should change status to sending request', function () {
                viewModel.finish();
                expect(viewModel.status()).toBe('sendingRequests');
            });

            it('should get course from repository', function () {
                viewModel.finish();
                expect(repository.get).toHaveBeenCalled();
            });

            it('should call course finish', function () {
                spyOn(course, 'finish');

                viewModel.finish();
                expect(course.finish).toHaveBeenCalled();
            });

            describe('when course finished', function () {
                beforeEach(function () {
                    spyOn(windowOperations, 'close');
                    spyOn(course, 'finish').andCallFake(function (callback) {
                        callback();
                    });
                });

                it('should change status to fiished', function () {
                    viewModel.finish();
                    expect(viewModel.status()).toBe('finished');
                });

                it('should call windows operations close', function () {
                    viewModel.finish();
                    expect(windowOperations.close).toHaveBeenCalled();
                });

            });
        });

    });
});