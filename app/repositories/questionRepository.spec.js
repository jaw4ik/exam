define(['context', 'repositories/questionRepository', 'plugins/http', 'configuration/settings'], function (context, repository, http, settings) {

    describe('repository [questionRepository]', function () {

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

                describe('and when questionId is not string', function () {

                    it('should throw exception with \'Question id is not a string\'', function () {
                        var f = function () {
                            repository.get('', null);
                        };
                        expect(f).toThrow('Question id is not a string');
                    });

                });

                describe('and when questionId is a string', function () {
                    var objectiveId = 'objectiveId';
                    var questionId = 'questionId';

                    describe('and when objective is not found', function () {
                        beforeEach(function () {
                            context.course = {};
                            context.course.objectives = [];
                        });

                        it('should return null', function () {
                            var result = repository.get(objectiveId, questionId);
                            expect(result).toBeNull();
                        });
                    });

                    describe('and when objective is found', function () {
                        var objective = { id: objectiveId };
                        beforeEach(function () {
                            context.course = {};
                            context.course.objectives = [objective];
                        });

                        describe('and when question is not found', function () {
                            beforeEach(function () {
                                objective.questions = [];
                                context.course.objectives = [objective];
                            });

                            it('should return null', function () {
                                var result = repository.get(objectiveId, questionId);
                                expect(result).toBeNull();
                            });
                        });

                        describe('and when question is found', function () {
                            var question = { id: questionId };
                            beforeEach(function () {
                                objective.questions = [question];
                                context.course.objectives = [objective];
                            });

                            it('should return question', function () {
                                var result = repository.get(objectiveId, questionId);
                                expect(result).toBe(question);
                            });
                        });

                    });
                });

            });
        });

        describe('loadQuestionContent:', function () {
            var deferred = null;
            beforeEach(function () {
                deferred = Q.defer();
                spyOn(http, 'get').andReturn(deferred.promise);
            });

            it('should be function', function () {
                expect(repository.loadQuestionContent).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.loadQuestionContent({})).toBePromise();
            });

            describe('when objectiveId is not a string', function () {
                it('should be rejected with \'Objective id is not a string\'', function () {
                    var promise = repository.loadQuestionContent(null);
                    deferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Objective id is not a string');
                    });
                });
            });

            describe('when questions id is not a string', function () {
                it('should be rejected with \'Question id is not a string\'', function () {
                    var promise = repository.loadQuestionContent('', null);
                    deferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Question id is not a string');
                    });
                });
            });

            describe('when question is not found', function () {
                beforeEach(function () {
                    context.course = {};
                    context.course.objectives = [];
                });

                it('should be rejected with \'Question is not an object\'', function () {
                    var promise = repository.loadQuestionContent('', '');
                    deferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Question is not an object');
                    });
                });
            });

            describe('when question is found', function () {
                var questionId = '0', objectiveId = '0';
                var question = {
                    id: questionId
                };
                beforeEach(function () {
                    context.course = {};
                    context.course.objectives = [{
                        id: objectiveId,
                        questions: [question]
                    }];
                });

                describe('and when question does not have content', function () {
                    beforeEach(function () {
                        question.hasContent = false;
                    });

                    it('should resolve promise with question', function () {
                        var promise = repository.loadQuestionContent(objectiveId, questionId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolvedWith(question);
                        });
                    });

                    it('should not load content', function () {
                        var promise = repository.loadQuestionContent(objectiveId, questionId);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(http.get).not.toHaveBeenCalled();
                        });
                    });
                });

                describe('and when question has content', function () {
                    var content = 'content';
                    beforeEach(function () {
                        question.hasContent = true;
                    });

                    it('should load content', function () {
                        var promise = repository.loadQuestionContent(objectiveId, questionId);
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
                            var promise = repository.loadQuestionContent(objectiveId, questionId);
                            deferred.resolve(content);

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                question.content = content;
                                expect(promise).toBeResolvedWith(question);
                            });
                        });

                    });

                    describe('and when failed to load content', function () {
                        it('should set error message to question content', function () {
                            var promise = repository.loadQuestionContent(objectiveId, questionId);
                            deferred.reject();

                            waitsFor(function () {
                                return !promise.isPending();
                            });
                            runs(function () {
                                question.content = settings.questionContentNonExistError;
                                expect(promise).toBeResolvedWith(question);
                            });
                        });
                    });
                });
            });
        });

        describe('loadQuestionContentCollection:', function () {
            var deferred = null;
            var questionId = '0', objectiveId = '0';
            var question = {
                id: questionId,
                objectiveId: objectiveId
            };
            beforeEach(function () {
                context.course = {};
                context.course.objectives = [{
                    id: objectiveId,
                    questions: [question]
                }];
                deferred = Q.defer();
                spyOn(Q, 'allSettled').andReturn(deferred.promise);
            });

            it('should be function', function () {
                expect(repository.loadQuestionContentCollection).toBeFunction();
            });

            it('should return promise', function () {
                expect(repository.loadQuestionContentCollection({})).toBePromise();
            });

            describe('when questions is not an array', function () {
                it('should be rejected with \'Questions is not an array\'', function () {
                    var promise = repository.loadQuestionContentCollection(null);
                    deferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(promise).toBeRejectedWith('Questions is not an array');
                    });
                });
            });

            describe('when questions is an array', function () {

                it('should call Q allSettled', function () {
                    var promise = repository.loadQuestionContentCollection([question]);
                    deferred.resolve();

                    waitsFor(function () {
                        return !promise.isPending();
                    });
                    runs(function () {
                        expect(Q.allSettled).toHaveBeenCalled();
                    });
                });

                describe('and when all promises are settled', function () {
                    it('should resolve promise with questions', function () {
                        var promise = repository.loadQuestionContentCollection([question]);
                        deferred.resolve([{ value: question }]);

                        waitsFor(function () {
                            return !promise.isPending();
                        });
                        runs(function () {
                            expect(promise).toBeResolvedWith([question]);
                        });
                    });
                });

            });
        });

    });
});