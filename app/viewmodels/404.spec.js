define(function (require) {
    "use strict";

    var viewModel = require('viewmodels/404');

    describe('viewModel [404]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('activate:', function() {

            it('should be function', function() {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function() {
                expect(viewModel.activate()).toBePromise();
            });

        });
    });
});