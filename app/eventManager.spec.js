define(['eventManager'],
    function (eventManager) {

        var
            app = require('durandal/app');

        describe('viewModel [eventManager]', function () {

            beforeEach(function () {
                spyOn(app, "trigger");
            });

            it('should be defined', function () {
                expect(eventManager).toBeDefined();
            });

            describe('events:', function () {

                it('should be defined', function () {
                    expect(eventManager.events).toBeDefined();
                });

            });

            describe('turnAllEventsOff:', function () {

                it('should call app.off for all events', function () {
                    spyOn(app, 'off');

                    eventManager.turnAllEventsOff();

                    var eventList = [];
                    _.each(eventManager.events, function (event) {
                        eventList.push(event);
                    });

                    expect(app.off.calls.length).toEqual(eventList.length);
                });

            });

            describe('subscribeForEvent:', function () {

                it('should return promise', function () {
                    var result = eventManager.subscribeForEvent(eventManager.events.courseStarted);
                    expect(result).toBePromise();
                });

                describe('when event is unsupported', function () {

                    it('should throw exception', function () {
                        var action = function () {
                            eventManager.subscribeForEvent('asdasdasd');
                        };

                        expect(action).toThrow('Unsupported event');
                    });

                });

                describe('when event is supported', function () {

                    it('should subscribe function for event', function () {
                        spyOn(app, 'on');
                        eventManager.subscribeForEvent(eventManager.events.courseStarted);
                        expect(app.on).toHaveBeenCalledWith(eventManager.events.courseStarted);
                    });

                });

            });

            describe('courseStarted', function () {

                it('should be function', function () {
                    expect(eventManager.courseStarted).toBeFunction();
                });

                it('should call app.trigger event with parameter "courseStarted"', function () {
                    eventManager.courseStarted({});
                    expect(app.trigger).toHaveBeenCalledWith("courseStarted", {});
                });
            });

            describe('answersSubmitted', function () {

                it('should be function', function () {
                    expect(eventManager.answersSubmitted).toBeFunction();
                });

                it('should call app.trigger event with parameter "answersSubmitted"', function () {
                    eventManager.answersSubmitted({});
                    expect(app.trigger).toHaveBeenCalledWith("answersSubmitted", {});
                });
            });

            describe('courseFinished:', function () {

                it('should return promise', function () {
                    var result = eventManager.courseFinished();
                    expect(result).toBePromise();
                });

                describe('when there are no subscribers', function () {

                    it('should execute callback', function () {
                        var result = false;
                        var callback = function () {
                            result = true;
                        };

                        var promise = eventManager.courseFinished({}, callback);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(result).toBeTruthy();
                        });
                    });
                });

                describe('when there are returned promises in subscribers', function () {

                    describe('and there is callback', function () {

                        it('should execute callback after all subscriptions are done', function () {
                            var result = null;
                            var callback = function () {
                                result = true;
                            };
                            var subscription = app.on("courseFinished").then(function () {
                                return Q.fcall(function () {
                                    result = false;
                                    subscription.off();
                                });
                            });

                            var promise = eventManager.courseFinished({}, callback);
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(result).toBeTruthy();
                            });
                        });
                    });

                    describe('and there is no callback', function () {

                        it('should execute all subscriptions', function () {
                            var result = null;

                            var subscription = app.on("courseFinished").then(function () {
                                return Q.fcall(function () {
                                    result = false;
                                    subscription.off();
                                });
                            });

                            var promise = eventManager.courseFinished({});
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(result).toBeFalsy();
                            });
                        });
                    });

                });

                describe('when there are no returned promises in subscribers', function () {

                    describe('and there is callback', function () {

                        it('should execute callback', function () {
                            var result = null;
                            var callback = function () {
                                result = true;
                            };
                            var subscription = app.on("courseFinished").then(function () {
                                result = false;
                                subscription.off();
                            });

                            var promise = eventManager.courseFinished({}, callback);
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(result).toBeTruthy();
                            });
                        });
                    });

                    describe('and there is no callback', function () {

                        it('should execute subscribers', function () {
                            var result = null;

                            var subscription = app.on("courseFinished").then(function () {
                                result = false;
                                subscription.off();
                            });

                            var promise = eventManager.courseFinished({});
                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                expect(result).toBeFalsy();
                            });
                        });
                    });

                });
            });
        });

    }
);