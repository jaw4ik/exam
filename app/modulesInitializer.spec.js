define(['modulesInitializer'],
    function (modulesInitializer) {

        "use strict";

        describe('module [modulesInitializer]', function () {

            it('should be defined', function () {
                expect(modulesInitializer).toBeDefined();
            });

            describe('register:', function () {

                it('should be function', function () {
                    expect(modulesInitializer.register).toBeFunction();
                });

                describe('when configuration parameter is not an object', function () {
                    it('should throw an exception', function () {
                        var f = function () { modulesInitializer.register(false); };
                        expect(f).toThrow();
                    });
                });

            });

            describe('init:', function () {

                it('should be function', function () {
                    expect(modulesInitializer.init).toBeFunction();
                });

                it('should return promise', function () {
                    expect(modulesInitializer.init()).toBePromise();
                });

                describe('when modules to register count is 0', function () {

                    it('should return promise', function () {
                        expect(modulesInitializer.init()).toBePromise();
                    });

                });

                describe('when modules to register count is more than 0', function () {
                    describe('should throw an exception', function () {

                        it('if config for some module is number', function () {
                            modulesInitializer.register({ 'module1': 1 });
                            var f = function () { modulesInitializer.init(); };
                            expect(f).toThrow();
                        });

                        it('if config for some module is string', function () {
                            modulesInitializer.register({ 'module1': 'ololo' });
                            var f = function () { modulesInitializer.init(); };
                            expect(f).toThrow();
                        });
                    });


                    describe('and all configs are valid', function () {
                        var moduleLoader = require('moduleLoader');

                        describe('should not load module', function () {

                            beforeEach(function () {
                                spyOn(moduleLoader, 'loadModule');
                            });

                            it('if config for some module is undefined', function () {
                                modulesInitializer.register({ 'module1': undefined });
                                modulesInitializer.init();
                                expect(moduleLoader.loadModule).not.toHaveBeenCalled();
                            });

                            it('if config for some module is null', function () {
                                modulesInitializer.register({ 'module1': null });
                                modulesInitializer.init();
                                expect(moduleLoader.loadModule).not.toHaveBeenCalled();
                            });

                            it('if config is boolean with value false', function () {
                                modulesInitializer.register({ 'module1': false });
                                modulesInitializer.init();
                                expect(moduleLoader.loadModule).not.toHaveBeenCalled();
                            });

                            it('if config is object and contains "enable" boolean with value false', function () {
                                modulesInitializer.register({ 'module1': { setting1: 1, settung2: 'test', enabled: false } });
                                modulesInitializer.init();
                                expect(moduleLoader.loadModule).not.toHaveBeenCalled();
                            });
                        });

                        describe('should load module', function () {
                            var deferred;
                            var module;

                            beforeEach(function () {
                                deferred = Q.defer();
                                module = {
                                    __moduleId__: 'module1',
                                    initialize: function () {
                                    }
                                };
                                spyOn(moduleLoader, 'loadModule').andCallFake(function () {
                                    deferred.resolve(module);
                                    return deferred.promise;
                                });
                            });
                            it('if config is boolean with value true', function () {
                                modulesInitializer.register({ 'module1': true });
                                modulesInitializer.init();
                                expect(moduleLoader.loadModule).toHaveBeenCalled();
                            });

                            it('if config is object and contains "enable" boolean with value true', function () {
                                modulesInitializer.register({ 'module1': { setting1: 1, setting2: 'test', enabled: true } });
                                modulesInitializer.init();
                                expect(moduleLoader.loadModule).toHaveBeenCalled();
                            });

                            it('if config is object and does not contain enable boolean', function () {
                                modulesInitializer.register({ 'module1': { setting1: 1, setting2: 'test' } });
                                modulesInitializer.init();
                                expect(moduleLoader.loadModule).toHaveBeenCalled();
                            });
                        });
                    });
                }
                );
            });
        });
    }
);