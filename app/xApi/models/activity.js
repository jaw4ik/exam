define(['../guard', './object', './activityDefinition'],
    function (guard, object, activityDefinition) {

        var activity = function (spec) {
            
            if (typeof spec == typeof undefined) throw 'You should provide a specification to create an Activity';

            guard.throwIfNotString(spec.id, 'You should provide identity for Activity');
            guard.throwIfNotAnObject(spec.definition, 'You should provide definition for Activity');

            spec.objectType = 'Activity';

            var obj = new object(spec);
            obj.id = spec.id;
            obj.definition = new activityDefinition(spec.definition);

            return obj;
        };

        return activity;
    }
);