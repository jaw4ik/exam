define(['context', 'repositories/courseRepository'], function (context, repository) {

    describe('repository [courseRepository]', function () {

        it('should be defined', function () {
            expect(repository).toBeDefined();
        });

        describe('get:', function () {
            it('should return function', function () {
                expect(repository.get).toBeFunction();
            });
            
            describe('and when course is not an object', function () {
                beforeEach(function () {
                    context.course = undefined;
                });

                it('should return null', function () {
                    var result = repository.get();
                    expect(result).toBeNull();
                });
            });

            describe('and when course is an object', function () {
                var course = {};
                beforeEach(function () {
                    context.course = course;
                });

                it('should return course', function () {
                    var result = repository.get();
                    expect(result).toBe(course);
                });

            });

        });

    });
});