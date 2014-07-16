define(['../guard', './object'],
    function (guard, object) {

        var actor = function (spec) {

            if (typeof spec == typeof undefined) throw 'You should provide a specification to create an Actor';
            
            guard.throwIfNotMbox(spec.mbox, 'You should provide mbox identity for Actor');
            
            spec.objectType = 'Agent';

            var obj = new object(spec);
            obj.name = spec.name;
            obj.mbox = spec.mbox;

            return obj;
        };

        return actor;
    }
);