define([], function () {
    "use strict";

    return {
        execute: function () {
            ko.bindingHandlers.area = {
                init: function (element, valueAccessor) {
                    var
                        value = valueAccessor(),
                        click = value ? value.click : undefined,
                        offset, x, y
                    ;

                    $(element).on('click', handler);
                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        $(element).off('click', handler);
                    });

                    function handler(e) {
                        offset = $(element).offset();
                        x = e.pageX - offset.left;
                        y = e.pageY - offset.top;
                        if (typeof (click) == "function") {
                            click({ x: x, y: y });
                        }
                    }

                }
            };
        }
    };
});