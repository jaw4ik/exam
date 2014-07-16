define(['models/objective'], function (ObjectiveModel) {

    var courseSettings = require('modules/courseSettings');

    describe('model [objective]', function () {

        it('should be defined', function () {
            expect(ObjectiveModel).toBeDefined();
        });

        it('should return function', function () {
            expect(ObjectiveModel).toBeFunction();
        });

        var spec = {
            id: 'id',
            title: 'title',
            image: 'image',
            score: 0,
            questions: []
        };
        var objective;

        beforeEach(function () {
            objective = new ObjectiveModel(spec);
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(objective.id).toBeDefined();
            });

            it('should be equal to spec id', function () {
                expect(objective.id).toBe(spec.id);
            });
        });

        describe('title:', function () {
            it('should be defined', function () {
                expect(objective.title).toBeDefined();
            });

            it('should be equal to spec title', function () {
                expect(objective.title).toBe(spec.title);
            });
        });

        describe('image:', function () {
            it('should be defined', function () {
                expect(objective.image).toBeDefined();
            });

            it('should be equal to spec image', function () {
                expect(objective.image).toBe(spec.image);
            });
        });

        describe('score:', function () {
            it('should be defined', function () {
                expect(objective.score).toBeDefined();
            });

            it('should be equal to spec score', function () {
                expect(objective.score).toBe(spec.score);
            });
        });

        describe('questions:', function () {
            it('should be defined', function () {
                expect(objective.questions).toBeDefined();
            });

            it('should be equal to spec questions', function () {
                expect(objective.questions).toBe(spec.questions);
            });
        });

        describe('calculateScore:', function () {

            it('should be function', function () {
                expect(objective.calculateScore).toBeFunction();
            });

            it('should set score', function() {
                objective.score = 0;
                objective.questions = [{ score: 0 }, { score: 100 }];

                objective.calculateScore();
                expect(objective.score).toBe(50);
            });

            describe('calculateScore:', function () {

                it('should be function', function () {
                    expect(objective.calculateScore).toBeFunction();
                });

                it('should set score', function () {
                    objective.score = 0;
                    objective.questions = [{ score: 0 }, { score: 100 }];

                    objective.calculateScore();
                    expect(objective.score).toBe(50);
                });

                describe('when score value is fraction', function () {
                    it('should round score to floor', function () {
                        objective.score = 0;
                        objective.questions = [{ score: 0 }, { score: 100 }, { score: 67 }];

                        objective.calculateScore();
                        expect(objective.score).toBe(55);
                    });
                });

                describe('when score is less than mastery score', function () {
                    it('should set isCompleted to false', function () {
                        courseSettings.masteryScore.score = 80;
                        objective.isCompleted = true;
                        objective.questions = [{ score: 50 }];

                        objective.calculateScore();
                        expect(objective.isCompleted).toBe(false);
                    });
                });

                describe('when score is more than mastery score', function () {
                    it('should set isCompleted to true', function () {
                        courseSettings.masteryScore.score = 80;
                        objective.isCompleted = true;
                        objective.questions = [{ score: 100 }];

                        objective.calculateScore();
                        expect(objective.isCompleted).toBe(true);
                    });
                });

                describe('when objective has no questions', function () {
                    it('should set score to zero', function () {
                        objective.score = 100;
                        objective.questions = [];
                        objective.calculateScore();
                        expect(objective.score).toBe(0);
                    });

                    it('should set isCompleted to false', function () {
                        objective.isCompleted = true;
                        objective.questions = [];
                        objective.calculateScore();
                        expect(objective.isCompleted).toBe(false);
                    });
                });

            });

        });

        describe('isCompleted:', function () {
            it('should be defined', function () {
                expect(objective.isCompleted).toBeDefined();
            });

            it('should be equal to be false', function () {
                expect(objective.isCompleted).toBe(false);
            });
        });
    });
});