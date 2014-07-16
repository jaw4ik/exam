define(function (require) {
    "use strict";

    var module = require('modules/graphicalCustomization');

    describe('module [graphicalCustomization]', function () {

        var logoUrl;

        beforeEach(function () {
            logoUrl = 'some logo url';
            module.settings.logoUrl = logoUrl;
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

            describe('when settings has empty url', function () {

                it('should not update logoUrl', function () {
                    var settings = {
                        url: ''
                    };
                    var promise = module.initialize(settings);
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(module.settings.logoUrl).toBe(logoUrl);
                    });
                });

            });

            describe('when settings has url', function () {

                it('should update logoUrl', function () {
                    var newUrl = 'new logo url';
                    var settings = {
                        url: newUrl
                    };
                    var promise = module.initialize(settings);
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(module.settings.logoUrl).toBe(newUrl);
                    });
                });

            });

        });

        describe('settings:', function () {

            it('should be defined', function () {
                expect(module.settings).toBeDefined();
            });

            it('should set default value for logoUrl', function () {
                expect(module.settings.logoUrl).toBe(logoUrl);
            });

        });

    });
});