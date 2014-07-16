define(['../guard'],
    function (guard) {

        var verb = function (spec) {

            if (typeof spec == typeof undefined) throw 'You should provide a specification to create Verb';

            guard.throwIfNotVerbId(spec.id, 'You should provide valid id for Verb');
            guard.throwIfNotLanguageMap(spec.display, 'You should provide valid language map as display for Verb');

            return {
                id: spec.id,
                display: spec.display
            };
        };

        return verb;
    }
);