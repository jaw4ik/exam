define(['./routingManager', './requestManager', './activityProvider', './statementQueueHandler', './configuration/xApiSettings'],
    function (routingManager, requestManager, activityProvider, statementQueueHandler, xApiSettings) {

        "use strict";

        var
            isInitialized = false,
            moduleSettings = null,

            xApiInitializer = {
                init: init,
                getInitStatus: getInitStatus,
                turnOff: turnOff,
                initialize: initialize,
                createActor: activityProvider.createActor
            };

        return xApiInitializer;

        function init(courseId, actorData, activityName, activityUrl) {
            return Q.all([
                xApiSettings.init(moduleSettings),
                requestManager.init(),
                activityProvider.init(courseId, actorData, activityName, activityUrl)
            ]).spread(function () {
                isInitialized = true;
                statementQueueHandler.handle();
            });
        }

        function getInitStatus() {
            return isInitialized;
        }

        function turnOff() {
            activityProvider.turnOffSubscriptions();
            routingManager.removeRoutes();
            isInitialized = false;
        }

        //Initialization function for moduleManager
        function initialize(settings) {
            return Q.fcall(function () {
                moduleSettings = settings;
                routingManager.createGuard(xApiInitializer, 'login');
                routingManager.mapRoutes();
            });
        }
    }
);