define(['windowOperations'],
    function (windowOperations) {

        "use strict";

        describe('viewModel [windowOperations]', function () {

            it('should be defined', function () {
                expect(windowOperations).toBeDefined();
            });

            describe('close:', function () {

                beforeEach(function() {
                    spyOn(window, 'close').andCallFake(function () { });
                });

                it('should be function', function () {
                    expect(windowOperations.close).toBeFunction();
                });

                beforeEach(function () {
                    jasmine.Clock.useMock();
                    spyOn(window, 'alert').andCallFake(function () { });
                });

                it('should close window', function () {
                    windowOperations.close();
                    expect(window.close).toHaveBeenCalled();
                });


            });

        });

    }
);