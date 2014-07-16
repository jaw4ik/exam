define(['plugins/router', '../xApiInitializer'],
    function (router, xApiInitializer) {
        
        var
            navigateBackUrl = '',

            restartCourse = function () {
                var rootUrl = location.toString().replace(location.hash, '');
                router.navigate(rootUrl, { replace: true, trigger: true });
            },
            
            continueLearning = function () {
                xApiInitializer.turnOff();
                router.navigate(navigateBackUrl);
            },

            activate = function (backUrl) {
                navigateBackUrl = backUrl;
            };

        return {
            restartCourse: restartCourse,
            continueLearning: continueLearning,
            
            activate: activate
        };
    }
);