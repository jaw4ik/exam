define(['knockout'], function(ko) {
    "use strict";

    return {
        execute: function () {
            ko.bindingHandlers.autosizeTextArea = {
                init: function (element, valueAccessor, allBindingsAccessor, data, context) {
                    autosize($(element));
                }
            };
        }
    };
});