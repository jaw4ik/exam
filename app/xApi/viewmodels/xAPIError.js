define(['knockout', 'plugins/router', '../xApiInitializer', '../configuration/xApiSettings'],
    function (ko, router, xApiInitializer, xApiSettings) {

        var
            navigateBackUrl = '',

            allowToContinue = ko.observable(false);

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
                allowToContinue(!xApiSettings.xApi.required);
            };

        return {
            allowToContinue: allowToContinue,

            restartCourse: restartCourse,
            continueLearning: continueLearning,
            
            activate: activate
        };
    }
);