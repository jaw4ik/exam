define(['./login', 'xApi/xApiInitializer', 'context', 'plugins/router', 'repositories/courseRepository', 'xApi/errorsHandler'],
    function (viewModel, xApiInitializer, context, router, repository, errorsHandler) {

        "use strict";

        describe('viewModel [login]', function () {

            it('should be defined', function () {
                expect(viewModel).toBeDefined();
            });

            var course = {
                id: 'id',
                title: 'title',
                start: function () {
                }
            };

            beforeEach(function () {
                spyOn(router, 'navigate');
                spyOn(course, 'start');
                spyOn(repository, 'get').andReturn(course);
                spyOn(xApiInitializer, 'turnOff');
            });

            describe('usermail:', function () {

                it('should be observable', function () {
                    expect(viewModel.usermail).toBeObservable();
                });

                describe('trim:', function () {

                    it('should be function', function () {
                        expect(viewModel.usermail.trim).toBeFunction();
                    });

                    it('should trim value', function () {
                        viewModel.usermail('     some text     ');
                        viewModel.usermail.trim();
                        expect(viewModel.usermail()).toBe('some text');
                    });

                });

                describe('isModified', function () {

                    it('should be observable', function () {
                        expect(viewModel.usermail).toBeObservable();
                    });

                    it('should be false by default', function () {
                        expect(viewModel.usermail.isModified()).toBeFalsy();
                    });

                });

                describe('markAsModified', function () {

                    it('should be function', function () {
                        expect(viewModel.usermail.markAsModified).toBeFunction();
                    });

                    it('should mark question as modified', function () {
                        viewModel.usermail.isModified(false);
                        viewModel.usermail.markAsModified();
                        expect(viewModel.usermail.isModified()).toBeTruthy();
                    });

                });

                describe('isValid:', function () {

                    it('should be computed', function () {
                        expect(viewModel.usermail.isValid).toBeComputed();
                    });

                    describe('when usermail is not a string', function () {

                        it('should be false', function () {
                            viewModel.usermail(null);
                            expect(viewModel.usermail.isValid()).toBeFalsy();
                        });

                    });

                    describe('when usermail is an empty string', function () {

                        it('should be true', function () {
                            viewModel.usermail('');
                            expect(viewModel.usermail.isValid()).toBeFalsy();
                        });

                    });

                    describe('when usermail is a not-e-mail string', function () {

                        it('should be true', function () {
                            viewModel.usermail('Username');
                            expect(viewModel.usermail.isValid()).toBeFalsy();
                        });

                    });

                    describe('when usermail is an email string', function () {

                        it('should be true', function () {
                            viewModel.usermail('username@easygenerator.com');
                            expect(viewModel.usermail.isValid()).toBeTruthy();
                        });

                    });

                });

            });

            describe('username:', function () {

                it('should be observable', function () {
                    expect(viewModel.username).toBeObservable();
                });

                describe('trim:', function () {

                    it('should be function', function () {
                        expect(viewModel.username.trim).toBeFunction();
                    });

                    it('should return trimmed value', function () {
                        viewModel.username('     some text     ');
                        viewModel.username.trim();
                        expect(viewModel.username()).toBe('some text');
                    });

                });

                describe('isModified', function () {

                    it('should be observable', function () {
                        expect(viewModel.username).toBeObservable();
                    });

                    it('should be false by default', function () {
                        expect(viewModel.username.isModified()).toBeFalsy();
                    });

                });

                describe('markAsModified', function () {

                    it('should be function', function () {
                        expect(viewModel.username.markAsModified).toBeFunction();
                    });

                    it('should mark question as modified', function () {
                        viewModel.username.isModified(false);
                        viewModel.username.markAsModified();
                        expect(viewModel.username.isModified()).toBeTruthy();
                    });

                });

                describe('isValid:', function () {

                    it('should be computed', function () {
                        expect(viewModel.username.isValid).toBeComputed();
                    });

                    describe('when username is not a string', function () {

                        it('should be false', function () {
                            viewModel.username(null);
                            expect(viewModel.username.isValid()).toBeFalsy();
                        });

                    });

                    describe('when username is an empty string', function () {

                        it('should be true', function () {
                            viewModel.username('');
                            expect(viewModel.username.isValid()).toBeFalsy();
                        });

                    });

                    describe('when username consists of only white-spaces', function () {

                        it('should be true', function () {
                            viewModel.username('   ');
                            expect(viewModel.username.isValid()).toBeFalsy();
                        });

                    });

                    describe('when username is an email string', function () {

                        it('should be true', function () {
                            viewModel.username('username@easygenerator.com');
                            expect(viewModel.username.isValid()).toBeTruthy();
                        });

                    });

                });

            });

            describe('skip:', function () {

                it('should be function', function () {
                    expect(viewModel.skip).toBeFunction();
                });

                it('should turn off xApiInitializer', function () {
                    viewModel.skip();
                    expect(xApiInitializer.turnOff).toHaveBeenCalled();
                });

                it('should call course start', function () {
                    viewModel.skip();
                    expect(course.start).toHaveBeenCalled();
                });

                it('should navigate to root', function () {
                    viewModel.skip();
                    expect(router.navigate).toHaveBeenCalledWith('');
                });

            });

            describe('login:', function () {

                it('should be function', function () {
                    expect(viewModel.login).toBeFunction();
                });

                describe('when usermail or username are not valid', function () {

                    beforeEach(function () {
                        viewModel.usermail("not e-mail");
                        viewModel.username("          ");
                    });

                    it('should mark username as modified', function () {
                        spyOn(viewModel.username, 'markAsModified');
                        viewModel.login();
                        expect(viewModel.username.markAsModified).toHaveBeenCalled();
                    });

                    it('should mark usermail as modified', function () {
                        spyOn(viewModel.usermail, 'markAsModified');
                        viewModel.login();
                        expect(viewModel.usermail.markAsModified).toHaveBeenCalled();
                    });

                });

                describe('when usermail and username are valid', function () {

                    beforeEach(function () {
                        viewModel.usermail("test@mail.com");
                        viewModel.username("User");
                    });

                    it('should create actor data', function () {
                        spyOn(xApiInitializer, 'createActor');
                        viewModel.login();
                        expect(xApiInitializer.createActor).toHaveBeenCalledWith(viewModel.username(), viewModel.usermail());
                    });

                    var xApiInitializerInitDefer, xApiInitializerInitPromise;
                    beforeEach(function () {
                        xApiInitializerInitDefer = Q.defer();
                        xApiInitializerInitPromise = xApiInitializerInitDefer.promise.finally(function () { });;
                        spyOn(xApiInitializer, 'init').andReturn(xApiInitializerInitDefer.promise);
                    });

                    it('should init xApiInitializer', function () {
                        context.courseId = course.id;
                        context.title = course.title;
                        var
                            url = window.top.location.toString() + '?course_id=' + course.id,
                            actor = xApiInitializer.createActor(viewModel.username(), viewModel.usermail());

                        viewModel.login();
                        expect(xApiInitializer.init).toHaveBeenCalledWith(actor, course.title, url);
                    });

                    describe('and when xApiInitializer.init was rejected', function () {

                        it('should turn off xApiInitializer', function () {
                            xApiInitializerInitDefer.reject();
                            viewModel.login();
                            waitsFor(function () {
                                return !xApiInitializerInitPromise.isPending();
                            });
                            runs(function () {
                                expect(xApiInitializer.turnOff).toHaveBeenCalled();
                            });
                        });

                        it('should handle error', function () {
                            spyOn(errorsHandler, 'handleError');
                            xApiInitializerInitDefer.reject("Some reason");
                            viewModel.login();
                            waitsFor(function () {
                                return !xApiInitializerInitPromise.isPending();
                            });
                            runs(function () {
                                expect(errorsHandler.handleError).toHaveBeenCalledWith("Some reason");
                            });
                        });

                    });

                    describe('and when xApiInitializer.init was resolved', function () {

                        beforeEach(function () {
                            xApiInitializerInitDefer.resolve();
                            viewModel.login();
                        });

                        it('should call course start', function () {
                            waitsFor(function () {
                                return !xApiInitializerInitPromise.isPending();
                            });
                            runs(function () {
                                expect(course.start).toHaveBeenCalled();
                            });
                        });

                        it('should navigate to root', function () {
                            waitsFor(function () {
                                return !xApiInitializerInitPromise.isPending();
                            });
                            runs(function () {
                                expect(router.navigate).toHaveBeenCalledWith('');
                            });
                        });

                    });

                });

            });

        });

    }
);