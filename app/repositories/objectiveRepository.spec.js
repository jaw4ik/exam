define(['context', 'repositories/objectiveRepository'], function (context, repository) {

    describe('repository [objectiveRepository]', function () {

        it('should be defined', function () {
            expect(repository).toBeDefined();
        });

        describe('get:', function () {
            it('should return function', function () {
                expect(repository.get).toBeFunction();
            });

            describe('when objectiveId is not string', function () {

                it('should throw exception with \'Objective id is not a string\'', function () {
                    var f = function () {
                        repository.get(null, '');
                    };
                    expect(f).toThrow('Objective id is not a string');
                });

            });

            describe('when objectiveId is a string', function () {

                var objectiveId = 'objectiveId';

                describe('and when objective is not found', function () {
                    beforeEach(function () {
                        context.course = {};
                        context.course.objectives = [];
                    });

                    it('should return null', function () {
                        var result = repository.get(objectiveId);
                        expect(result).toBeNull();
                    });
                });

                describe('and when objective is found', function () {
                    var objective = { id: objectiveId };
                    beforeEach(function () {
                        context.course = {};
                        context.course.objectives = [objective];
                    });

                    it('should return objective', function () {
                        var result = repository.get(objectiveId);
                        expect(result).toBe(objective);
                    });

                });
            });

        });
    });

});