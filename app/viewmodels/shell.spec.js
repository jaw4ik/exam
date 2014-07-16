define(function (require) {
    "use strict";

    var
        viewModel = require('viewmodels/shell'),
        app = require('durandal/app'),
        router = require('plugins/router'),
        context = require('context'),
        modulesInitializer = require('modulesInitializer'),
        graphicalCustomization = require('modules/graphicalCustomization');

    describe('viewModel [shell]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('activate:', function () {

            var routerActivateDefer;
            beforeEach(function () {
                graphicalCustomization.settings.logoUrl = 'someUrl';

                routerActivateDefer = Q.defer();
                spyOn(router, 'activate').andReturn(routerActivateDefer.promise);
                routerActivateDefer.resolve();
            });

            it('should be function', function () {
                expect(viewModel.activate).toBeFunction();
            });

            var contextInitializeDefer;
            beforeEach(function () {
                contextInitializeDefer = Q.defer();
                spyOn(context, 'initialize').andReturn(contextInitializeDefer.promise);
                contextInitializeDefer.resolve({ course: { title: 'Course title' } });
            });

            it('should initialize context', function () {
                var promise = viewModel.activate();

                waitsFor(function() {
                    return !promise.isPending();
                });
                runs(function() {
                    expect(context.initialize).toHaveBeenCalled();
                });
            });

            describe('when context initialized', function() {

                it('should set application title', function() {
                    var promise = viewModel.activate();

                    waitsFor(function() {
                        return !promise.isPending();
                    });
                    runs(function() {
                        expect(app.title).toBe('Course title');
                    });
                });

                it('should add replace method to router', function () {
                    var promise = viewModel.activate();
                    
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(router.replace).toBeFunction();
                    });
                });

                var modulesInitializeDefer;
                beforeEach(function () {
                    modulesInitializeDefer = Q.defer();
                    spyOn(modulesInitializer, 'init').andReturn(modulesInitializeDefer.promise);
                    modulesInitializeDefer.resolve();
                });

                it('should initialize modules', function () {
                    var promise = viewModel.activate().fin(function () { });;
                    
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(modulesInitializer.init).toHaveBeenCalled();
                    });
                });

                describe('and when modules are initialized', function() {

                    it('should set logoUrl', function () {
                        var promise = viewModel.activate();

                        waitsFor(function() {
                            return !promise.isPending();
                        });
                        runs(function() {
                            expect(viewModel.logoUrl()).toBe(graphicalCustomization.settings.logoUrl);
                        });
                    });

                    it('should activate router', function() {
                        var promise = viewModel.activate();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(router.activate).toHaveBeenCalled();
                        });
                    });

                });

            });

        });

        describe('router:', function () {
            
            it('should be defined', function () {
                expect(router).toBeDefined();
            });
            
        });

        describe('logoUrl', function () {

            it('should be defined', function () {
                expect(viewModel.logoUrl).toBeDefined();
            });

        });

    });
});