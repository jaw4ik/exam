define(['./xApiInitializer', './routingManager', './requestManager', './activityProvider', 'browserSupport'],
    function (xApiInitializer, routingManager, requestManager, activityProvider, browserSupport) {

        "use strict";

        describe('viewModel [xApiInitializer]', function() {

            it('should be defined', function() {
                expect(xApiInitializer).toBeDefined();
            });

            var requestManagerDefer, activityProviderDefer;
            beforeEach(function () {
                requestManagerDefer = Q.defer();
                spyOn(requestManager, 'init').andReturn(requestManagerDefer.promise);

                activityProviderDefer = Q.defer();
                spyOn(activityProvider, 'init').andReturn(activityProviderDefer.promise);
            });

            describe('init:', function () {

                it('should be function', function() {
                    expect(xApiInitializer.init).toBeFunction();
                });

                it('should return promise', function() {
                    expect(xApiInitializer.init()).toBePromise();
                });

                it('should init requestManager', function () {
                    var promise = xApiInitializer.init();
                    
                    requestManagerDefer.resolve();
                    activityProviderDefer.resolve();

                    waitsFor(function() {
                        return !promise.isPending();
                    });
                    runs(function() {
                        expect(requestManager.init).toHaveBeenCalled();
                    });
                });

                it('should init activityProvider', function() {
                    var promise = xApiInitializer.init();
                    
                    requestManagerDefer.resolve();
                    activityProviderDefer.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(activityProvider.init).toHaveBeenCalled();
                    });
                });

                it('should set isInitialized to true', function () {
                    var promise = xApiInitializer.init();

                    requestManagerDefer.resolve();
                    activityProviderDefer.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(xApiInitializer.getInitStatus()).toBeTruthy();
                    });
                });

            });

            describe('initialize:', function () {

                it('should be function', function() {
                    expect(xApiInitializer.initialize).toBeFunction();
                });

                it('should return promise', function() {
                    expect(xApiInitializer.initialize()).toBePromise();
                });

                it('should call routingManager.createGuard method with login view if browser is not IE9', function () {
                    browserSupport.isIE9 = false;

                    spyOn(routingManager, 'createGuard');
                    var settings = { lrs: { uri: window.location.protocol } };
                    var promise = xApiInitializer.initialize(settings);
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(routingManager.createGuard).toHaveBeenCalledWith(xApiInitializer, 'login');
                    });
                });

                it('should call routingManager.createGuard method with xapierror view if browser is IE9', function () {
                    browserSupport.isIE9 = true;

                    spyOn(routingManager, 'createGuard');
                    var settings = { lrs: { uri: window.location.protocol != "http:" ? "http:" : "https:" } };
                    var promise = xApiInitializer.initialize(settings);
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(routingManager.createGuard).toHaveBeenCalledWith(xApiInitializer, 'xapinotsupported');
                    });
                });

                it('should call routingManager.mapRoute method', function () {
                    spyOn(routingManager, 'mapRoutes');
                    var settings = { lrs: { uri: window.location.protocol != "http:" ? "http:" : "https:" } };
                    var promise = xApiInitializer.initialize(settings);
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(routingManager.mapRoutes).toHaveBeenCalled();
                    });
                });

            });

            describe('turnOff:', function () {

                it('should be function', function () {
                    expect(xApiInitializer.turnOff).toBeFunction();
                });

                it('should turn all xApi subscriptions off', function () {
                    spyOn(activityProvider, 'turnOffSubscriptions');
                    xApiInitializer.turnOff();
                    expect(activityProvider.turnOffSubscriptions).toHaveBeenCalled();
                });

                it('should remove routes', function () {
                    spyOn(routingManager, 'removeRoutes');
                    xApiInitializer.turnOff();
                    expect(routingManager.removeRoutes).toHaveBeenCalled();
                });

                it('should set init status to false', function() {
                    xApiInitializer.turnOff();
                    expect(xApiInitializer.getInitStatus()).toBeFalsy();
                });

            });

            describe('getInitStatus:', function() {

                it('should be function', function() {
                    expect(xApiInitializer.getInitStatus).toBeFunction();
                });

                describe('when xApiInitializer not initialized', function() {

                    it('should return false', function () {
                        xApiInitializer.turnOff();
                        expect(xApiInitializer.getInitStatus()).toBeFalsy();
                    });

                });

                describe('when xApiInitializer is initialized', function () {

                    it('should return true', function() {
                        var promise = xApiInitializer.init();

                        requestManagerDefer.resolve();
                        activityProviderDefer.resolve();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(xApiInitializer.getInitStatus()).toBeTruthy();
                        });
                    });

                });

            });

        });

    }
);