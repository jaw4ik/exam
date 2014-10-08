define(['./models/actor', './models/statement', './models/activity', './configuration/xApiSettings', 'eventManager', './constants', './errorsHandler', './utils/dateTimeConverter', 'xApi/statementQueue'],
    function (actorModel, statementModel, activityModel, xApiSettings, eventManager, constants, errorsHandler, dateTimeConverter, statementQueue) {
        "use strict";

        var subscriptions = [],
            activityProvider = {
                actor: null,
                activityName: null,
                init: init,
                createActor: createActor,
                rootCourseUrl: null,
                rootActivityUrl: null,
                turnOffSubscriptions: turnOffSubscriptions
            };

        return activityProvider;

        function init(actorData, activityName, activityUrl) {
            return Q.fcall(function () {
                if (_.isUndefined(xApiSettings.scoresDistribution.positiveVerb)) {
                    throw errorsHandler.errors.notEnoughDataInSettings;
                }

                activityProvider.actor = actorData;
                activityProvider.activityName = activityName;
                activityProvider.rootCourseUrl = activityUrl.split("?")[0].split("#")[0];
                activityProvider.rootActivityUrl = activityProvider.rootCourseUrl + '#questions';
                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.courseStarted).then(enqueueCourseStarted));
                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.courseFinished).then(enqueueCourseFinished));
                subscriptions.push(eventManager.subscribeForEvent(eventManager.events.answersSubmitted).then(enqueueAnsweredQuestionsStatements));
            });

        }

        function turnOffSubscriptions() {
            _.each(subscriptions, function (subscription) {
                if (!_.isNullOrUndefined(subscription && subscription.off)) {
                    subscription.off();
                }
            });
        }

        function enqueueCourseStarted() {
            pushStatementIfSupported(createStatement(constants.verbs.started));
        }

        function pushStatementIfSupported(statement) {
            if (_.contains(xApiSettings.xApi.allowedVerbs, statement.verb.display[xApiSettings.defaultLanguage])) {
                statementQueue.enqueue(statement);
            }
        }

        function enqueueCourseFinished(finishedEventData) {
            enqueueObjectivesFinished(finishedEventData.objectives);

            var result = {
                score: finishedEventData.result
            };

            var verb = finishedEventData.isCompleted ? xApiSettings.scoresDistribution.positiveVerb : constants.verbs.failed;

            pushStatementIfSupported(createStatement(verb, result, createActivity(activityProvider.activityName)));
            pushStatementIfSupported(createStatement(constants.verbs.stopped, null, createActivity(activityProvider.activityName)));

            var dfd = Q.defer();

            statementQueue.statements.subscribe(function (newValue) {
                if (newValue.length == 0) {
                    dfd.resolve();
                }
            });

            // (^\ x_x /^)
            statementQueue.enqueue(undefined);

            return dfd.promise;
        }

        function enqueueObjectivesFinished(objectives) {
            _.each(objectives, function (objective) {
                var statement = createStatement(constants.verbs.mastered, { score: objective.score / 100 }, createActivityForObjective(objective.id, objective.title));
                pushStatementIfSupported(statement);
            });
        }

        function enqueueAnsweredQuestionsStatements(eventData) {
            switch (eventData.type) {
                case constants.interactionTypes.choice:
                    enqueueSelectTextQuestionAnsweredStatement(eventData);
                    break;
                case constants.interactionTypes.fillIn:
                    enqueueFillInQuestionAnsweredStatement(eventData);
                    break;
                case constants.interactionTypes.dragAndDrop:
                    enqueueDragAndDropTextQuestionAnsweredStatement(eventData);
                    break;
                case constants.interactionTypes.matching:
                    enqueueTextMatchingQuestionAnsweredStatement(eventData);
                case constants.interactionTypes.hotspot:
                    enqueueHotSpotQuestionAnsweredStatement(eventData);
                    break;
            }
        }

        function enqueueHotSpotQuestionAnsweredStatement(eventData) {
            var question = eventData.question,
                objective = eventData.objective;

            var questionUrl = activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id;
            var result = {
                score: question.score / 100,
                response: question.placedMarkers.join("[,]")
            };

            var object = {
                id: questionUrl,
                definition: {
                    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
                    name: {
                        "en-US": question.title
                    },
                    interactionType: constants.interactionTypes.other,
                    correctResponsesPattern: question.spots
                }
            };

            var parentUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;
            var context = {
                contextActivities: {
                    parent: [createActivity(objective.title, parentUrl)]
                }
            };

            pushStatementIfSupported(createStatement(constants.verbs.answered, result, object, context));
        }

        function enqueueSelectTextQuestionAnsweredStatement(eventData) {
            var question = eventData.question,
                objective = eventData.objective;

            var questionUrl = activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id;
            var result = {
                score: question.score / 100,
                response: question.selectedAnswersIds.toString()
            };

            var object = {
                id: questionUrl,
                definition: {
                    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
                    name: {
                        "en-US": question.title
                    },
                    interactionType: constants.interactionTypes.choice,
                    correctResponsesPattern: [question.correctAnswersIds.join("[,]")],
                    choices: _.map(question.answers, function (item) {
                        return {
                            id: item.id,
                            description: {
                                "en-US": item.text
                            }
                        };
                    })
                }
            };

            var parentUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;
            var context = {
                contextActivities: {
                    parent: [createActivity(objective.title, parentUrl)]
                }
            };

            pushStatementIfSupported(createStatement(constants.verbs.answered, result, object, context));
        }

        function enqueueFillInQuestionAnsweredStatement(eventData) {
            var question = eventData.question,
                objective = eventData.objective;

            var questionUrl = activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id;
            var result = {
                score: question.score / 100,
                response: question.enteredAnswersTexts.toString()
            };

            var object = {
                id: questionUrl,
                definition: {
                    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
                    name: {
                        "en-US": question.title
                    },
                    interactionType: constants.interactionTypes.fillIn,
                    correctResponsesPattern: [question.correctAnswersTexts.join("[,]")]
                }
            };

            var parentUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;
            var context = {
                contextActivities: {
                    parent: [createActivity(objective.title, parentUrl)]
                }
            };

            pushStatementIfSupported(createStatement(constants.verbs.answered, result, object, context));
        }

        function enqueueDragAndDropTextQuestionAnsweredStatement(eventData) {
            var question = eventData.question,
                objective = eventData.objective;

            var questionUrl = activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id;
            var result = {
                score: question.score / 100,
                response: question.enteredAnswersTexts.join("[,]")
            };

            var object = {
                id: questionUrl,
                definition: {
                    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
                    name: {
                        "en-US": question.title
                    },
                    interactionType: constants.interactionTypes.other,
                    correctResponsesPattern: [question.correctAnswersTexts.join("[,]")]
                }
            };

            var parentUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;
            var context = {
                contextActivities: {
                    parent: [createActivity(objective.title, parentUrl)]
                }
            };

            pushStatementIfSupported(createStatement(constants.verbs.answered, result, object, context));
        }

        function enqueueTextMatchingQuestionAnsweredStatement(eventData) {
            var question = eventData.question,
                objective = eventData.objective;

            var questionUrl = activityProvider.rootCourseUrl + '#objective/' + question.objectiveId + '/question/' + question.id;
            var result = {
                score: question.score / 100,
                response: _.map(question.answers, function (answer) {
                    return answer.key.toLowerCase() + "[.]" + (answer.attemptedValue ? answer.attemptedValue.toLowerCase() : "");
                }).join("[,]")
            };

            var object = {
                id: questionUrl,
                definition: {
                    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
                    description: {
                        "en-US": question.title
                    },
                    interactionType: constants.interactionTypes.matching,
                    correctResponsesPattern: [_.map(question.answers, function (answer) {
                        return answer.key.toLowerCase() + "[.]" + answer.value.toLowerCase();
                    }).join("[,]")],
                    source: _.map(question.answers, function (answer) {
                        return { id: answer.key.toLowerCase(), description: { "en-US": answer.key } }
                    }),
                    target: _.map(question.answers, function (answer) {
                        return { id: answer.value.toLowerCase(), description: { "en-US": answer.value } }
                    })
                }
            };

            var parentUrl = activityProvider.rootCourseUrl + '#objectives?objective_id=' + objective.id;
            var context = {
                contextActivities: {
                    parent: [createActivity(objective.title, parentUrl)]
                }
            };

            pushStatementIfSupported(createStatement(constants.verbs.answered, result, object, context));
        }

        function createActor(name, email) {
            var actor = {};

            try {
                actor = actorModel({
                    name: name,
                    mbox: 'mailto:' + email
                });
            } catch (e) {
                errorsHandler.handleError(errorsHandler.errors.actorDataIsIncorrect);
            }

            return actor;
        }

        function createActivity(name, id) {
            return activityModel({
                id: id || activityProvider.rootActivityUrl,
                definition: {
                    name: {
                        "en-US": name
                    }
                }
            });
        }

        function createStatement(verb, result, activity, context) {
            var activityData = activity || createActivity(activityProvider.activityName);

            return statementModel({
                actor: activityProvider.actor,
                verb: verb,
                object: activityData,
                result: result,
                context: context
            });
        }

        function getActiviryUrlForQuestion(questionId) {
            return activityProvider.rootActivityUrl + '?questionid=' + questionId;
        }

        function createActivityForQuestion(questionId, questionTitle) {
            var activityId = getActiviryUrlForQuestion(questionId);
            return createActivity(questionTitle, activityId);
        }

        function createActivityForObjective(objectiveId, objectiveTitle) {
            var activityId = activityProvider.rootActivityUrl + '?objectiveid=' + objectiveId;
            return createActivity(objectiveTitle, activityId);
        }
    }
);