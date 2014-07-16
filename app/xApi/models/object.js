define(['../guard'],
    function (guard) {
        
        var object = function (spec) {

            if (typeof spec == typeof undefined) throw 'You should provide a specification to create Object';

            guard.throwIfNotString(spec.objectType, 'You should provide object type');

            return {
                objectType: spec.objectType
            };
        };

        return object;

    }
);