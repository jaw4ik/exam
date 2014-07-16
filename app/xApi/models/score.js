define(['../guard'],
    function (guard) {

        var statement = function (spec) {

            if (typeof spec == typeof undefined) throw 'You should provide a specification to create Statement';

            guard.throwIfNotNumber(spec, 'You should provide score');

            var obj = {};
            
            if (spec >= 0 && spec <= 1) {
                obj.scaled = spec;
            } else {
                obj.raw = spec;
            }
            
            return obj;
        };

        return statement;
    }
);