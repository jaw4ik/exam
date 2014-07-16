define(['moduleLoader'],
    function (moduleLoader) {

        describe('moduleLoader', function () {
            it('should be defined', function () {
                expect(moduleLoader).toBeDefined();
            });

            describe('loadModule:', function () {

                it('should be function', function () {
                    expect(moduleLoader.loadModule).toBeFunction();
                });

                it('should return promise', function () {
                    expect(moduleLoader.loadModule()).toBePromise();
                });
            });
        });
    }
);