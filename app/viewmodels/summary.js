define(['durandal/app', 'plugins/router', 'context', 'eventManager', 'windowOperations', 'repositories/courseRepository', 'templateSettings'],
    function (app, router, context, eventManager, windowOperations, repository, templateSettings) {
        var objectives = [],
            overallScore = 0,
            masteryScore = 0,

            statuses = {
                readyToFinish: 'readyToFinish',
                sendingRequests: 'sendingRequests',
                finished: 'finished'
            },

            status = ko.observable(statuses.readyToFinish),

            finish = function () {
                status(statuses.sendingRequests);

                var course = repository.get();
                course.finish(onCourseFinishedCallback);
            },

            onCourseFinishedCallback = function () {
                status(statuses.finished);
                windowOperations.close();
            },

            activate = function () {
                var course = repository.get();
                if (course == null) {
                    router.navigate('404');
                    return;
                }

                course.calculateScore();

                this.overallScore = course.score;
                this.masteryScore = templateSettings.masteryScore.score;
                this.objectives = _.map(course.objectives, function (item) {
                    return {
                        id: item.id,
                        title: item.title,
                        score: item.score
                    };
                });
            },
            canActivate = function () {
                var course = repository.get();
                return course.isAnswered() ? true : { redirect: '#' };
            };

        return {
            activate: activate,
            canActivate: canActivate,

            objectives: objectives,
            overallScore: overallScore,
            masteryScore: masteryScore,
            courseTitle: context.title,
            finish: finish,
            status: status,
            statuses: statuses
        };
    }
);