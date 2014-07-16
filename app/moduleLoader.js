define(function () {

    return {
        loadModule: loadModule
    };

    function loadModule(modulePath) {
        var defer = Q.defer();
        require([modulePath],
            function (module) {
                defer.resolve(module);
            },
            function (error) {
                defer.reject({ modulePath: error.requireModules && error.requireModules[0], messsage: error.message });
            });

        return defer.promise;
    }
});
