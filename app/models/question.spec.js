define(['models/question'], function (QuestionModel) {

    var
        http = require('plugins/http'),
        settings = require('configuration/settings');

    describe('model [question]', function () {

        it('should be defined', function () {
            expect(QuestionModel).toBeDefined();
        });

        it('should return function', function () {
            expect(QuestionModel).toBeFunction();
        });

        var answers = [{
            id: '0',
            isCorrect: true,
            isChecked: false
        },
        {
            id: '1',
            isCorrect: false,
            isChecked: false
        }, {
            id: '2',
            isCorrect: true,
            isChecked: false
        },
        {
            id: '3',
            isCorrect: false,
            isChecked: false
        }];

        var spec = {
            id: 'id',
            objectiveId: 'objId',
            title: 'title',
            hasContent: false,
            score: 0,
            answers: answers
        };
        var question;

        beforeEach(function () {
            question = new QuestionModel(spec);
        });

        describe('id:', function () {
            it('should be defined', function () {
                expect(question.id).toBeDefined();
            });

            it('should be equal to spec id', function () {
                expect(question.id).toBe(spec.id);
            });
        });

        describe('title:', function () {
            it('should be defined', function () {
                expect(question.title).toBeDefined();
            });

            it('should be equal to spec title', function () {
                expect(question.title).toBe(spec.title);
            });
        });

        describe('hasContent:', function () {
            it('should be defined', function () {
                expect(question.hasContent).toBeDefined();
            });

            it('should be equal to spec hasContent', function () {
                expect(question.hasContent).toBe(spec.hasContent);
            });
        });

        describe('score:', function () {
            it('should be defined', function () {
                expect(question.score).toBeDefined();
            });

            it('should be equal to spec score', function () {
                expect(question.score).toBe(spec.score);
            });
        });

        describe('answers:', function () {
            it('should be defined', function () {
                expect(question.answers).toBeDefined();
            });

            it('should be equal to spec answers', function () {
                expect(question.answers).toBe(spec.answers);
            });
        });

        describe('submitAnswer:', function () {

            it('should be function', function () {
                expect(question.submitAnswer).toBeFunction();
            });

            describe('when checked answers ids is not an array', function () {
                it('should throw exception with \'Checked answer ids is not an array\'', function () {
                    var f = function () {
                        question.submitAnswer(null);
                    };
                    expect(f).toThrow('Checked answer ids is not an array');
                });
            });

            describe('when checked answers ids is an array', function () {

                it('should update answers checked values', function () {
                    question.submitAnswer(['0', '2']);
                    expect(question.answers[0].isChecked).toBeTruthy();
                    expect(question.answers[1].isChecked).toBeFalsy();
                    expect(question.answers[2].isChecked).toBeTruthy();
                    expect(question.answers[3].isChecked).toBeFalsy();
                });

                it('should set isAnswered to true', function () {
                    question.isAnswered = false;
                    question.submitAnswer(['0', '2']);
                    expect(question.isAnswered).toBeTruthy();
                });

                describe('when all answers checked correct', function () {
                    var answersIds = ['0', '2'];
                    it('should set score to 100', function () {
                        question.score = 0;
                        question.submitAnswer(['0', '2']);
                        expect(question.score).toBe(100);
                    });

                    it('should set isCorrectAnswered to true', function () {
                        question.isCorrectAnswered = false;
                        question.submitAnswer(answersIds);
                        expect(question.isCorrectAnswered).toBe(true);
                    });
                });

                describe('when answers checked partually correct', function () {
                    var answersIds = ['0', '1'];
                    it('should set score to 0', function () {
                        question.score = 0;
                        question.submitAnswer(answersIds);
                        expect(question.score).toBe(0);
                    });

                    it('should set isCorrectAnswered to false', function () {
                        question.isCorrectAnswered = true;
                        question.submitAnswer(answersIds);
                        expect(question.isCorrectAnswered).toBe(false);
                    });
                });

                describe('when answers checked incorrect', function () {
                    var answersIds = ['1', '3'];
                    it('should set score to 0', function () {
                        question.score = 0;
                        question.submitAnswer(answersIds);
                        expect(question.score).toBe(0);
                    });

                    it('should set isCorrectAnswered to false', function () {
                        question.isCorrectAnswered = true;
                        question.submitAnswer(answersIds);
                        expect(question.isCorrectAnswered).toBe(false);
                    });
                });
            });
        });

        describe('loadContent:', function () {
            var deferred = null;
            beforeEach(function () {
                deferred = Q.defer();
                spyOn(http, 'get').andReturn(deferred.promise);
            });

            it('should be function', function () {
                expect(question.loadContent).toBeFunction();
            });

            it('should return promise', function () {
                expect(question.loadContent({})).toBePromise();
            });

            describe('and when question does not have content', function () {
                beforeEach(function () {
                    question.hasContent = false;
                    question.content = undefined;
                });

                it('should resolve promise', function () {
                    var promise = question.loadContent();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeResolved();
                    });
                });

                it('should not load content', function () {
                    var promise = question.loadContent();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(http.get).not.toHaveBeenCalled();
                    });
                });

                it('should not change question content', function () {
                    var promise = question.loadContent();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(question.content).toBeUndefined();
                    });
                });
            });

            describe('and when question has content', function () {
                beforeEach(function () {
                    question.hasContent = true;
                });

                var content = 'content';

                it('should load content', function () {
                    var promise = question.loadContent();
                    deferred.resolve(content);

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(http.get).toHaveBeenCalledWith('content/' + question.objectiveId + '/' + question.id + '/content.html');
                    });
                });

                describe('and when content loaded successfully', function () {

                    it('should set question content', function () {
                        var promise = question.loadContent();
                        deferred.resolve(content);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(question.content).toBe(content);
                        });
                    });

                    it('should resolve promise', function () {
                        var promise = question.loadContent();
                        deferred.resolve(content);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });
                    });

                });

                describe('and when failed to load content', function () {
                    it('should set error message to question content', function () {
                        var promise = question.loadContent();
                        deferred.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(question.content).toBe(settings.questionContentNonExistError);
                        });
                    });

                    it('should resolve promise', function () {
                        var promise = question.loadContent();
                        deferred.reject();

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolved();
                        });
                    });
                });

            });
        });
    });
});