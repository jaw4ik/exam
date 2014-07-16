define(['xApi/activityProvider', './requestManager', './configuration/xApiSettings', './errorsHandler', 'eventManager', 'xApi/constants'],
    function (viewModel, requestManager, xApiSettings, errorsHandler, eventManager, constants) {
        "use strict";
        var app = require('durandal/app');
        
        describe('viewModel [activityProvider]', function () {

            it('should be defined', function() {
                expect(viewModel).toBeDefined();
            });

            describe('actor', function() {
                it('should be defined', function () {
                    expect(viewModel.actor).toBeDefined();
                });
            });

            describe('activityName', function () {
                it('should be defined', function() {
                    expect(viewModel.activityName).toBeDefined();
                });
            });

            describe('rootCourseUrl', function () {
                it('should be defined', function() {
                    expect(viewModel.rootCourseUrl).toBeDefined();
                });
            });

            describe('rootActivityUrl', function () {
                it('should be defined', function() {
                    expect(viewModel.rootActivityUrl).toBeDefined();
                });
            });

            describe('init:', function () {

                it('should be function', function() {
                    expect(viewModel.init).toBeFunction();
                });

                it('should return promise', function() {
                    expect(viewModel.init()).toBePromise();
                });

                var actorData, activityName, activityUrl, activityUrlResult, eventMangerDefer, promise;

                beforeEach(function () {
                    actorData = { name: 'actor' };
                    activityName = 'activityName';
                    activityUrl = 'activityUrl/#url?querystring';
                    activityUrlResult = 'activityUrl/';
                });

                describe('when not enough data in xApiSettings', function () {
                    it('should reject promise', function () {
                        xApiSettings.scoresDistribution.positiveVerb = undefined;
                        promise = viewModel.init(actorData, activityName, activityUrl);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeRejectedWith(errorsHandler.errors.notEnoughDataInSettings);
                        });
                    });
                });

                describe('when enough data in xApiSettings', function () {

                    beforeEach(function () {
                        eventMangerDefer = Q.defer();
                        spyOn(eventManager, 'subscribeForEvent').andReturn(eventMangerDefer.promise);
                        promise = viewModel.init(actorData, activityName, activityUrl);
                        xApiSettings.scoresDistribution.positiveVerb = constants.verbs.passed;
                    });

                    it('shoud set actor', function () {
                        waitsFor(function() {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.actor).toBe(actorData);
                        });
                    });

                    it('shoud set activityName', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.activityName).toBe(activityName);
                        });
                    });

                    it('shoud set rootCourseUrl', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.rootCourseUrl).toBe(activityUrlResult);
                        });
                    });

                    it('shoul set rootActivityUrl', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.rootActivityUrl).toBe(activityUrlResult + '#questions');
                        });
                    });

                    it('should subscribe event courseStarted', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(eventManager.subscribeForEvent).toHaveBeenCalledWith(eventManager.events.courseStarted);
                        });
                    });

                    it('should subscribe event answersSubmitted', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(eventManager.subscribeForEvent).toHaveBeenCalledWith(eventManager.events.answersSubmitted);
                        });
                    });

                    it('should subscribe event courseFinished', function () {
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(eventManager.subscribeForEvent).toHaveBeenCalledWith(eventManager.events.courseFinished);
                        });
                    });

                });

            });

            describe('createActor:', function () {

                it('should be function', function() {
                    expect(viewModel.createActor).toBeFunction();
                });

                it('should return Actor', function() {
                    var result = viewModel.createActor('SomeName', 'fake@gmail.com');

                    expect(result.name).toBe('SomeName');
                    expect(result.mbox).toBe('mailto:fake@gmail.com');
                });

            });

            describe('turnOffSubscriptions:', function () {
                var promise;
                
                beforeEach(function() {
                    spyOn(requestManager, 'sendStatement');
                    promise = viewModel.init({name: 'actor'}, 'activity', 'url');
                });

                it('should be function', function () {
                    expect(viewModel.turnOffSubscriptions).toBeFunction();
                });

                it('should not send request to LRS when trigger "courseStarted"', function () {
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        viewModel.turnOffSubscriptions();
                        app.trigger("courseStarted");
                        
                        expect(requestManager.sendStatement).not.toHaveBeenCalled();
                    });
                });

                it('should not send request to LRS when trigger "courseFinished"', function () {
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        viewModel.turnOffSubscriptions();
                        app.trigger("courseFinished", { result: 1 });
                        
                        expect(requestManager.sendStatement).not.toHaveBeenCalled();
                    });
                });

                it('should not send request to LRS when trigger "questionSubmitted"', function () {
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        viewModel.turnOffSubscriptions();
                        app.trigger("questionSubmitted");
                        
                        expect(requestManager.sendStatement).not.toHaveBeenCalled();
                    });
                });
            });
        });
    }
);