define(['durandal/app', './requestManager', './statementQueue'], function (app, requestManager, statementQueue) {

    return {
        handle: handle
    };

    function handle() {
        var statement = statementQueue.dequeue();

        if (statement) {
            return requestManager.sendStatement(statement).then(handle);
        } else {
            var subscription = statementQueue.statements.subscribe(function () {
                handle();
                subscription.dispose();
            });
        }

    }

});