define(['./xAPINotSupported', 'eventManager', 'plugins/router', 'xApi/xApiInitializer', 'repositories/courseRepository'],
    function (viewModel, eventManager, router, xApiInitializer, repository) {

        "use strict";

        describe('viewModel [xAPINotSupported]', function () {

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
                spyOn(eventManager, 'courseStarted');
                spyOn(course, 'start');
                spyOn(repository, 'get').andReturn(course);
                spyOn(xApiInitializer, 'turnOff');
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

                it('should trigger event "courseStarted"', function () {
                    viewModel.skip();
                    expect(eventManager.courseStarted).toHaveBeenCalledWith();
                });

                it('should navigate to root', function () {
                    viewModel.skip();
                    expect(router.navigate).toHaveBeenCalledWith('');
                });

            });
        });

    }
);