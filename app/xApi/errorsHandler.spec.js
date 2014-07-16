define(['xApi/errorsHandler'],
    function (viewModel) {
        "use strict";

        var router = require('plugins/router');

        describe('viewModel [errorsHandler]', function () {

            beforeEach(function () {
                spyOn(router, 'navigate');
            });

            it('should be defined', function () {
                expect(viewModel).toBeDefined();
            });

            describe('errors:', function () {

                it('should be object', function () {
                    expect(viewModel.errors).toBeObject();
                });

                describe('errors.invalidEndpoint:', function () {

                    it('should be defined', function () {
                        expect(viewModel.errors.invalidEndpoint).toBeDefined();
                    });

                    it('should be equal \'Invalid endpoint\'', function () {
                        expect(viewModel.errors.invalidEndpoint).toEqual('Invalid endpoint');
                    });

                });

                describe('errors.notFoundEndpoint:', function () {

                    it('should be defined', function () {
                        expect(viewModel.errors.notFoundEndpoint).toBeDefined();
                    });

                    it('should be equal \'Not found endpoint\'', function () {
                        expect(viewModel.errors.notFoundEndpoint).toEqual('Not found endpoint');
                    });

                });

                describe('errors.invalidCredentials:', function () {

                    it('should be defined', function () {
                        expect(viewModel.errors.invalidCredentials).toBeDefined();
                    });

                    it('should be equal \'Invalid credentials\'', function () {
                        expect(viewModel.errors.invalidCredentials).toEqual('Invalid credentials');
                    });

                });

                describe('errors.invalidEmail:', function () {

                    it('should be defined', function () {
                        expect(viewModel.errors.invalidEmail).toBeDefined();
                    });

                    it('should be equal \'Invalid e-mail\'', function () {
                        expect(viewModel.errors.invalidEmail).toEqual('Invalid e-mail');
                    });

                });

                describe('errors.invalidProtocol:', function () {

                    it('should be defined', function () {
                        expect(viewModel.errors.invalidProtocol).toBeDefined();
                    });

                    it('should be equal \'Invalid protocol\'', function () {
                        expect(viewModel.errors.invalidProtocol).toEqual('Invalid protocol');
                    });

                });

                describe('errors.xDomainRequestError:', function () {

                    it('should be defined', function () {
                        expect(viewModel.errors.xDomainRequestError).toBeDefined();
                    });

                    it('should be equal \'XDomainRequest error\'', function () {
                        expect(viewModel.errors.xDomainRequestError).toEqual('XDomainRequest error');
                    });

                });

                describe('errors.timeoutError:', function () {

                    it('should be defined', function () {
                        expect(viewModel.errors.timeoutError).toBeDefined();
                    });

                    it('should be equal \'Timeout error\'', function () {
                        expect(viewModel.errors.timeoutError).toEqual('Timeout error');
                    });

                });

                describe('errors.xApiCorsNotSupported:', function () {

                    it('should be defined', function () {
                        expect(viewModel.errors.xApiCorsNotSupported).toBeDefined();
                    });

                    it('should be equal \'xAPI CORS Not Supported\'', function () {
                        expect(viewModel.errors.xApiCorsNotSupported).toEqual('xAPI CORS Not Supported');
                    });

                });

                describe('errors.badRequest:', function () {

                    it('should be defined', function () {
                        expect(viewModel.errors.badRequest).toBeDefined();
                    });

                    it('should be equal \'Bad request: \'', function () {
                        expect(viewModel.errors.badRequest).toEqual('Bad request: ');
                    });

                });

                describe('errors.unhandledMessage:', function () {

                    it('should be defined', function () {
                        expect(viewModel.errors.unhandledMessage).toBeDefined();
                    });

                    it('should be equal \'Unhandled error: \'', function () {
                        expect(viewModel.errors.unhandledMessage).toEqual('Unhandled error: ');
                    });

                });

                describe('errors.verbIsIncorrect:', function () {

                    it('should be defined', function () {
                        expect(viewModel.errors.verbIsIncorrect).toBeDefined();
                    });

                    it('should be equal \'Vebr object is not well formed\'', function () {
                        expect(viewModel.errors.verbIsIncorrect).toEqual('Vebr object is not well formed');
                    });

                });

                describe('errors.actorDataIsIncorrect:', function () {

                    it('should be defined', function () {
                        expect(viewModel.errors.actorDataIsIncorrect).toBeDefined();
                    });

                    it('should be equal \'Actor data is incorrect\'', function () {
                        expect(viewModel.errors.actorDataIsIncorrect).toEqual('Actor data is incorrect');
                    });

                });

                describe('errors.notEnoughDataInSettings:', function () {

                    it('should be defined', function () {
                        expect(viewModel.errors.notEnoughDataInSettings).toBeDefined();
                    });

                    it('should be equal \'Request failed: Not enough data in the settings\'', function () {
                        expect(viewModel.errors.notEnoughDataInSettings).toEqual('Request failed: Not enough data in the settings');
                    });

                });

            });

            describe('handleError:', function () {

                it('should be defined', function () {
                    expect(viewModel.handleError).toBeDefined();
                });

                it('should be function', function () {
                    expect(viewModel.handleError).toBeFunction();
                });

            });

        });
    }
);