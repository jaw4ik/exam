define(['eventManager', 'guard', 'eventDataBuilders/courseEventDataBuilder', 'plugins/http', 'constants'],
    function (eventManager, guard, eventDataBuilder, http, constants) {

        function Course(spec) {
            this.id = spec.id;
            this.createdOn = spec.createdOn;
            this.title = spec.title;
            this.hasIntroductionContent = spec.hasIntroductionContent;
            this.content = null;
            this.objectives = spec.objectives;
            this.score = spec.score;
            this.isAnswered = isAnswered;
            this.allQuestions = getAllQuestions(spec.objectives);
            this.finish = finish;
            this.calculateScore = calculateScore;
            this.start = start;
            this.loadContent = loadContent;
            this.isCompleted = false;
            this.isFinished = false;
            this.getStatus = getStatus;
        }

        function getAllQuestions(objectives) {
            var questionsList = [];

            _.each(objectives, function (objective) {
                questionsList = questionsList.concat(objective.questions);
            });

            return _.shuffle(questionsList);
        }

        function getStatus() {
            if (!this.isFinished) {
                return constants.course.statuses.inProgress;
            }

            return this.isCompleted ? constants.course.statuses.completed : constants.course.statuses.failed;
        }

        var finish = function (callback) {
            this.isFinished = true;
            eventManager.courseFinished(
                eventDataBuilder.buildCourseFinishedEventData(this), function () {
                    eventManager.turnAllEventsOff();
                    callback();
                });
        };

        var isAnswered = function () {
            var notAnsweredQuestion = _.filter(this.allQuestions, function (question) {
                return !question.isAnswered;
            });

            return notAnsweredQuestion.length === 0;
        };

        var start = function () {
            this.score = 0;
            eventManager.courseStarted();
        };

        var calculateScore = function () {
            var result = _.reduce(this.objectives, function (memo, objective) {
                objective.calculateScore();
                return memo + objective.score;
            }, 0);

            var objectivesLength = this.objectives.length;
            if (objectivesLength > 0) {
                this.score = Math.floor(result / objectivesLength);
                this.isCompleted = !_.some(this.objectives, function (objective) {
                    return !objective.isCompleted;
                });
            } else {
                this.score = 0;
                this.isCompleted = true;
            }
        };

        var loadContent = function () {
            var that = this;
            return Q.fcall(function () {
                if (!that.hasIntroductionContent) {
                    return null;
                }

                return http.get('content/content.html')
                    .then(function (response) {
                        that.content = response;
                        return that.content;
                    })
                    .fail(function () {
                        that.content = null;
                        return that.content;
                    });
            });
        };

        return Course;
    }
);