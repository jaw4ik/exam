define(function (require) {
    "use strict";

    var module = require('modules/courseSettings');

    describe('module [courseSettings]', function () {

        var masteryScore;

        beforeEach(function () {
            masteryScore = 80;
        });

        it('should be defined', function () {
            expect(module).toBeDefined();
        });

        describe('initialize:', function () {

            it('should be function', function () {
                expect(module.initialize).toBeFunction();
            });

            it('should return promise', function () {
                expect(module.initialize()).toBePromise();
            });

            describe('when settings mastery score is not a number', function () {

                it('should set mastery score 100', function () {
                    var settings = {
                        score: undefined
                    };
                    var promise = module.initialize(settings);
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(module.masteryScore.score).toBe(100);
                    });
                });

            });

            describe('when settings mastery score is less than 0', function () {

                it('should set mastery score 100', function () {
                    var settings = {
                        score: '-1'
                    };
                    var promise = module.initialize(settings);
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(module.masteryScore.score).toBe(100);
                    });
                });

            });

            describe('when settings mastery score is more than 100', function () {

                it('should set mastery score 100', function () {
                    var settings = {
                        score: '101'
                    };
                    var promise = module.initialize(settings);
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(module.masteryScore.score).toBe(100);
                    });
                });

            });

            describe('when settings have mastery score', function () {

                it('should set mastery score', function () {
                    var settings = {
                        score: new String(masteryScore)
                    };

                    var promise = module.initialize(settings);
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(module.masteryScore.score).toBe(masteryScore);
                    });
                });

            });

        });

    });
});