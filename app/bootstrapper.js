define(['durandal/system', 'bootstrapper.tasks'], function (system, tasks) {

    return {
        run: run
    };


    function run() {
        _.each(tasks.getCollection(), function (task) {
            if (_.isFunction(task.execute)) {
                task.execute();
            } else {
                system.log('Bootstrapper task ' + system.getModuleId(task) + 'is not executable');
            }

        });
    }

})