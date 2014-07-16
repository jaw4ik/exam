define(['xApi/guard'],
    function (viewModel) {

        var constants = require('xApi/constants');

        describe('viewModel [guard]', function() {

            it('should be defined', function() {
                expect(viewModel).toBeDefined();
            });

            describe('throwIfNotEmail:', function () {

                it('should be function', function() {
                    expect(viewModel.throwIfNotEmail).toBeFunction();
                });

                describe('when email is not a string', function() {

                    it('should throw exception', function() {
                        var action = function () {
                            viewModel.throwIfNotEmail(10, 'Some test message');
                        };
                        expect(action).toThrow('Some test message');
                    });

                });

                describe('when email is invalid', function () {

                    it('should throw exception', function () {
                        var action = function () {
                            viewModel.throwIfNotEmail('asdasd', 'Some test message');
                        };
                        expect(action).toThrow('Some test message');
                    });

                });

                describe('when email is string and valid', function () {

                    it('should not throw exception', function () {
                        var action = function () {
                            viewModel.throwIfNotEmail('asdasd@gmail.com', 'Some test message');
                        };
                        expect(action).not.toThrow('Some test message');
                    });

                });

            });

            describe('throwIfNotMbox:', function () {

                it('should be function', function() {
                    expect(viewModel.throwIfNotMbox).toBeFunction();
                });

                describe('when mbox is not a string', function() {

                    it('should throw exception', function() {
                        var action = function () {
                            viewModel.throwIfNotMbox(10, 'Some exception');
                        };
                        expect(action).toThrow('Some exception');
                    });

                });
                
                describe('when mbox have no mailto: part', function () {

                    it('should throw exception', function () {
                        var action = function () {
                            viewModel.throwIfNotMbox('qwerty@gmail.com', 'Some exception');
                        };
                        expect(action).toThrow('Some exception');
                    });

                });
                
                describe('when mbox have no email part', function () {

                    it('should throw exception', function () {
                        var action = function () {
                            viewModel.throwIfNotMbox('mailto:qweqeqweq', 'Some exception');
                        };
                        expect(action).toThrow('Some exception');
                    });

                });
                
                describe('when mbox have mailto: and email part', function () {

                    it('should not throw exception', function () {
                        var action = function () {
                            viewModel.throwIfNotMbox('mailto:qweqeqweq@gmail.com', 'Some exception');
                        };
                        expect(action).not.toThrow('Some exception');
                    });

                });

            });

            describe('throwIfNotLanguageMap:', function () {

                it('should be function', function() {
                    expect(viewModel.throwIfNotLanguageMap).toBeFunction();
                });

                describe('when display is not an object', function() {

                    it('should throw exception', function() {
                        var action = function () {
                            viewModel.throwIfNotLanguageMap('asdas', 'Some error message');
                        };
                        expect(action).toThrow('Some error message');
                    });

                });


                describe('when localized object is not a string', function() {
                    
                    it('should throw exception', function () {
                        var action = function () {
                            viewModel.throwIfNotLanguageMap({'en-us': {} }, 'Some error message');
                        };
                        expect(action).toThrow('Some error message');
                    });

                });
                
                describe('when localized object is a string', function () {

                    it('should not throw exception', function () {
                        var action = function () {
                            viewModel.throwIfNotLanguageMap({ 'en-us': "some key" }, 'Some error message');
                        };
                        expect(action).not.toThrow('Some error message');
                    });

                });
                
            });

            describe('throwIfNotVerbId:', function () {

                it('should be function', function() {
                    expect(viewModel.throwIfNotVerbId).toBeFunction();
                });

                describe('when id is not a string', function() {

                    it('should throw an exception', function() {
                        var action = function() {
                            viewModel.throwIfNotVerbId(11, 'Some error message');
                        };
                        expect(action).toThrow('Some error message');
                    });

                });

                describe('when id is invalid', function () {

                    it('should throw an exception', function () {
                        var action = function () {
                            viewModel.throwIfNotVerbId('asdasdadsad', 'Some error message');
                        };
                        expect(action).toThrow('Some error message');
                    });

                });
                
                describe('when id is valid', function () {

                    it('should not throw an exception', function () {
                        var action = function () {
                            viewModel.throwIfNotVerbId(constants.verbs.started.id, 'Some error message');
                        };
                        expect(action).not.toThrow('Some error message');
                    });

                });

            });

            describe('throwIfNotString:', function () {

                it('should be function', function() {
                    expect(viewModel.throwIfNotString).toBeFunction();
                });

                describe('when text is not string', function() {

                    it('should throw exception', function() {
                        var action = function () {
                            viewModel.throwIfNotString(11, 'Some error message');
                        };
                        expect(action).toThrow('Some error message');
                    });

                });
                
                describe('when text is string', function () {

                    it('should not throw exception', function () {
                        var action = function () {
                            viewModel.throwIfNotString('asdasdas', 'Some error message');
                        };
                        expect(action).not.toThrow('Some error message');
                    });

                });

            });

            describe('throwIfNotAnObject:', function () {
                
                it('should be function', function () {
                    expect(viewModel.throwIfNotAnObject).toBeFunction();
                });

                describe('when item is not object', function () {

                    it('should throw exception', function () {
                        var action = function () {
                            viewModel.throwIfNotAnObject(11, 'Some error message');
                        };
                        expect(action).toThrow('Some error message');
                    });

                });

                describe('when item is object', function () {

                    it('should not throw exception', function () {
                        var action = function () {
                            viewModel.throwIfNotAnObject({}, 'Some error message');
                        };
                        expect(action).not.toThrow('Some error message');
                    });

                });

            });
            
            describe('throwIfNotNumber:', function () {

                it('should be function', function () {
                    expect(viewModel.throwIfNotNumber).toBeFunction();
                });

                describe('when item is not number', function () {

                    it('should throw exception', function () {
                        var action = function () {
                            viewModel.throwIfNotNumber('11', 'Some error message');
                        };
                        expect(action).toThrow('Some error message');
                    });

                });

                describe('when item is number', function () {

                    it('should not throw exception', function () {
                        var action = function () {
                            viewModel.throwIfNotNumber(11, 'Some error message');
                        };
                        expect(action).not.toThrow('Some error message');
                    });

                });

            });

            describe('throwIfNotISODuration:', function () {

                it('should be function', function() {
                    expect(viewModel.throwIfNotISODuration).toBeFunction();
                });
                
                describe('when item not string', function () {

                    it('should throw exception', function () {
                        var action = function () {
                            viewModel.throwIfNotISODuration(11, 'Some error message');
                        };
                        expect(action).toThrow('Some error message');
                    });
                    
                });

                describe('when item is string', function() {
                    
                    describe('and item not isoDuration', function () {

                        it('should throw exception', function () {
                            var action = function () {
                                viewModel.throwIfNotISODuration('111', 'Some error message');
                            };
                            expect(action).toThrow('Some error message');
                        });

                    });

                    describe('when item is isoDuration', function () {
                        
                        it('should not throw exception', function () {
                            var action = function () {
                                viewModel.throwIfNotISODuration('PT11H2M3S', 'Some error message');
                            };
                            expect(action).not.toThrow('Some error message');
                        });
                        
                    });

                });
                
            });

        });

    }
);