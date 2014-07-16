define(['xApi/utils/dateTimeConverter'], function (viewModel) {

    describe('viewModel [dateTimeConverter]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('timeToISODurationString:', function () {

            it('should be function', function() {
                expect(viewModel.timeToISODurationString).toBeFunction();
            });

            it('should throw if parametr not number', function () {
                var action = function () {
                    viewModel.timeToISODurationString('some string');
                };
                expect(action).toThrow('You should provide only number');
            });

            it('should return ISO string', function () {
                var result = viewModel.timeToISODurationString(1000);
                expect(result).toBe('PT0H0M1S');
            });

        });
    });

});