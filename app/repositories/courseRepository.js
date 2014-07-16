define([], function () {

    return {
        get: get
    };

    function get() {
        var context = require('context');
        return _.isObject(context.course) ? context.course : null;
    }

})