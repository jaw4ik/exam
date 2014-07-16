define(['viewmodels/introduction'], function (viewModel) {

    var router = require('plugins/router'),
        repository = require('repositories/courseRepository');

    describe('viewModel [introduction]', function () {

        it('should be defined', function () {
            expect(viewModel).toBeDefined();
        });

        describe('title:', function () {
            it('should be defined', function () {
                expect(viewModel.title).toBeDefined();
            });
        });

        describe('content:', function () {
            it('should be defined', function () {
                expect(viewModel.content).toBeDefined();
            });
        });

        describe('activate:', function () {

            var course = {
                title: 'title',
                hasIntroductionContent: false,
                loadContent: function () {
                }
            };

            it('should be defined', function () {
                expect(viewModel.activate).toBeFunction();
            });

            it('should return promise', function () {
                var result = viewModel.activate();
                expect(result).toBePromise();
            });

            describe('when course does not have content', function () {
                beforeEach(function () {
                    course.hasIntroductionContent = false;
                    spyOn(repository, 'get').andReturn(course);
                });

                it('should navigate to questions', function () {
                    spyOn(router, 'navigate');

                    var promise = viewModel.activate();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(router.navigate).toHaveBeenCalledWith('questions');
                    });
                });
            });

            describe('when course has content', function () {
                var deferred;

                beforeEach(function () {
                    course.hasIntroductionContent = true;
                    deferred = Q.defer();
                    spyOn(course, 'loadContent').andReturn(deferred.promise);
                    spyOn(repository, 'get').andReturn(course);
                });

                it('should set the title of course', function () {
                    viewModel.title = '';
                    var promise = viewModel.activate();
                    deferred.resolve();
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(viewModel.title).toBe('"' + course.title + '"');
                    });
                });

                it('should load course content', function () {
                    var promise = viewModel.activate();
                    deferred.resolve();
                    
                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(course.loadContent).toHaveBeenCalled();
                    });
                });

                describe('when course content loaded', function () {
                    it('should set content', function () {
                        var content = 'content';
                        var promise = viewModel.activate();
                        deferred.resolve(content);
                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(viewModel.content).toBe(content);
                        });
                    });
                });
            });
        });
        
        describe('canActivate:', function () {
            it('should be function', function () {
                expect(viewModel.canActivate).toBeFunction();
            });

            describe('when course has introduction content', function () {
                beforeEach(function () {
                    var course = {
                        hasIntroductionContent: true
                    };

                    spyOn(repository, 'get').andReturn(course);
                });

                it('should return true', function () {
                    var result = viewModel.canActivate();
                    expect(result).toBeTruthy();
                });
            });

            describe('when course does not have introduction content', function () {
                beforeEach(function () {
                    var course = {
                        hasIntroductionContent: false
                    };

                    spyOn(repository, 'get').andReturn(course);
                });

                it('should redirect to questions', function () {
                    var result = viewModel.canActivate();
                    expect(result.redirect).toBe('#questions');
                });
            });
        });

        describe('startCourse:', function () {
            it('should be defined', function () {
                expect(viewModel.startCourse).toBeFunction();
            });

            it('should navigate to questions', function () {
                spyOn(router, 'navigate');

                viewModel.startCourse();
                expect(router.navigate).toHaveBeenCalledWith('questions');
            });
        });

    });

});