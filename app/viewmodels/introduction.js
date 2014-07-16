define(['plugins/router', 'repositories/courseRepository'], function (router, repository) {

    var title = null,
        content = null,

        activate = function () {
            var that = this;
            return Q.fcall(function () {
                var course = repository.get();
                if (course == null) {
                    router.navigate('404');
                    return;
                }

                if (!course.hasIntroductionContent) {
                    router.navigate('questions');
                    return;
                }

                that.title = "\"" + course.title + "\"";
                return course.loadContent()
                    .then(function (result) {
                        that.content = result;
                    });
            });

        },

        canActivate = function () {
            if (!repository.get().hasIntroductionContent) {
                return { redirect: '#questions' };
            }
            
            return true;
        },

        startCourse = function () {
            router.navigate('questions');
        };

    return {
        title: title,
        content: content,

        startCourse: startCourse,
        activate: activate,
        canActivate: canActivate
    };
});