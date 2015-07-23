define(['context', 'constants', 'eventManager'], function (context, constants, eventManager) {
    return {
        initialize: initialize
    };

    function initialize() {
        return Q.fcall(function () {
            eventManager.subscribeForEvent(eventManager.events.courseFinished).then(saveResult);
        });
    }

    function saveResult() {
        var resultKey = constants.localStorageResultKey + context.course.id + context.course.createdOn;

        var result = {
            score: context.course.score,
            status: context.course.getStatus()
        };

        try {
            var string = JSON.stringify(result);
            localStorage.setItem(resultKey, string);
            return true;
        } catch (e) {
            console.log('Failed to store course result');
            return false;
        }
    }
});