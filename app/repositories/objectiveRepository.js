define(['guard'], function (guard) {

    return {
        get: get
    };

    function get(objectiveId) {
        var context = require('context');
        guard.throwIfNotString(objectiveId, 'Objective id is not a string');

        var objective = _.find(context.course.objectives, function (item) {
            return item.id == objectiveId;
        });

        if (!objective) {
            return null;
        }

        return objective;
    }

});