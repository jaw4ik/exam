define(['../guard', 'durandal/system', './result'],
    function (guard, system, resultModel) {
        
        var statement = function (spec) {

            if (typeof spec == typeof undefined) throw 'You should provide a specification to create Statement';

            guard.throwIfNotAnObject(spec.actor, 'You should provide actor for Statement');
            guard.throwIfNotAnObject(spec.verb, 'You should provide verb for Statement');
            guard.throwIfNotAnObject(spec.object, 'You should provide object for Statement');

            var obj = {};
            obj.id = system.guid();
            obj.actor = spec.actor;
            obj.verb = spec.verb;
            obj.object = spec.object;
            obj.timestamp = (new Date()).toISOString();

            if (_.isObject(spec.context)) {
                obj.context = spec.context;
            }

            if (_.isObject(spec.result)) {
                obj.result = new resultModel(spec.result);
            }

            return obj;
        };

        return statement;
    }
);