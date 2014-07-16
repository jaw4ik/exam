define(['plugins/router', 'eventManager', '../configuration/viewConstants', '../errorsHandler', 'xApi/xApiInitializer', 'repositories/courseRepository'],
    function (router, eventManager, viewConstants, errorsHandler, xApiInitializer, repository) {

        "use strict";

        var viewModel = {
            activate: activate,
            skip: skip
        };

        return viewModel;

        function skip() {
            xApiInitializer.turnOff();
            startCourse();
        };

        function startCourse() {
            var course = repository.get();
            course.start();
            eventManager.courseStarted();
            router.navigate('');
        };

        function activate() { };
    });