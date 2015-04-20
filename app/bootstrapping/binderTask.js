define(['durandal/binder', 'localization'], function (binder, localization) {

    return {
        execute: function () {
            binder.binding = function (obj, view) {
                localization.localize(view);
            }
        }
    };

})