define([], function () {

    var ticks = new Date().getTime();

    function read(filename) {
        var defer = Q.defer();
        $.getJSON(filename + '?_=' + ticks).then(function (json) {
            defer.resolve(json);
        }).fail(function () {
            defer.resolve({});
        });

        return defer.promise;
    }

    return {
        read: read
    };

});