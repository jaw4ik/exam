define(['xApi/configuration/xApiSettings'], function (viewModel) {

    describe('viewModel [xApiSettings]', function () {

        it('shold be define', function () {
            expect(viewModel).toBeDefined();
        });

        describe('init:', function () {

            it('should return promise', function () {
                expect(viewModel.init()).toBePromise();
            });

            it('should extend settings with template settings', function () {
                var templateSettings = {
                    test: 'test',
                    allowedVerbs: ['1', '2', '3']
                };

                var promise = viewModel.init(templateSettings);

                waitsFor(function () {
                    return !promise.isPending();
                });
                runs(function () {
                    expect(viewModel.xApi).toEqual(templateSettings);
                    expect(viewModel.xApi.allowedVerbs).toEqual(templateSettings.allowedVerbs);
                });
            });

        });

    });

});