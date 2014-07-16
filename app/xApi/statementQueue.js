define([], function () {

    var
        statements = ko.observableArray([])
    ;

    var queue = {
        statements: ko.computed({
            read: statements
        }),
        enqueue: enqueue,
        dequeue: dequeue
    };

    return queue;

    function enqueue(statement) {
        statements.push(statement);
    };

    function dequeue() {
        return statements.shift();
    };

})