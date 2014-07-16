define(['../guard'],
    function (guard) {

        var activityDefinition = function (spec) {

            if (typeof spec == typeof undefined) throw 'You should provide a specification to create an ActivityDefinition';


            guard.throwIfNotLanguageMap(spec.name, 'You should provide name for ActivityDefinition');

            return {
                name: spec.name
            };
        };

        return activityDefinition;
    }
);