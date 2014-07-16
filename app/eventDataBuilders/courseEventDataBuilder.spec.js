define(['eventDataBuilders/courseEventDataBuilder', 'repositories/objectiveRepository'], function (eventDataBuilder, objectiveRepository) {

    describe('[courseEventDataBuilder]', function () {

        var course = {
            score: 100,
            objectives: [{
                id: 'id',
                title: 'title',
                score: 100
            }],
            isCompleted: true
        };

        describe('buildCourseFinishedEventData:', function () {
            it('should be function', function () {
                expect(eventDataBuilder.buildCourseFinishedEventData).toBeFunction();
            });

            describe('when course is not an object', function () {
                it('should throw exception with \'Course is not an object\'', function () {
                    var f = function () {
                        eventDataBuilder.buildCourseFinishedEventData(null);
                    };
                    expect(f).toThrow('Course is not an object');
                });
            });

            describe('when course is an object', function () {

                it('should return object', function () {
                    var data = eventDataBuilder.buildCourseFinishedEventData(course);

                    expect(data.result).toBe(1);
                    expect(data.isCompleted).toBeTruthy();

                    expect(data.objectives.length).toBe(1);
                    expect(data.objectives[0].id).toBe(course.objectives[0].id);
                    expect(data.objectives[0].title).toBe(course.objectives[0].title);
                    expect(data.objectives[0].score).toBe(course.objectives[0].score);
                });

            });
        });

        describe('buildAnswersSubmittedEventData:', function () {
            it('should be function', function () {
                expect(eventDataBuilder.buildAnswersSubmittedEventData).toBeFunction();
            });

            describe('when course is not an object', function () {
                it('should throw exception with \'Course is not an object\'', function () {
                    var f = function () {
                        eventDataBuilder.buildAnswersSubmittedEventData(null);
                    };
                    expect(f).toThrow('Course is not an object');
                });
            });

            describe('when course is an object', function () {

                var objective = {
                    id: 'id',
                    title: 'title'
                };

                var question = {
                    id: '0',
                    title: 'title'
                };

                beforeEach(function () {
                    course.allQuestions = [question];
                    spyOn(objectiveRepository, 'get').andReturn(objective);
                });

                it('should return object', function () {
                    var data = eventDataBuilder.buildAnswersSubmittedEventData(course);

                    expect(data.length).toBe(1);
                    expect(data[0].question).toBeDefined();
                    expect(data[0].objective).toBeDefined();

                    expect(data[0].objective.id).toBe(objective.id);
                    expect(data[0].objective.title).toBe(objective.title);

                    expect(data[0].question.id).toBe(question.id);
                    expect(data[0].question.title).toBe(question.title);
                });

            });
        });

    });
});