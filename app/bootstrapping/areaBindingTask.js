define([], function () {
    "use strict";

    return {
        execute: function () {
            ko.bindingHandlers.area = {
                init: function (element, valueAccessor) {
                    var
                        value = valueAccessor(),
                        click = value ? value.click : undefined
                    ;

                    $(element).on('click', handler);
                    ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                        $(element).off('click', handler);
                    });

                    function handler(e) {
                        var
                            offset = $(element).offset(),
                            x = e.pageX - offset.left,
                            y = e.pageY - offset.top,
                            targetWidth = $(element).width(),
                            targetHeight = $(element).height()
                        ;


                        if (typeof (click) == "function") {
                            var point = {
                                x: Math.max(0, Math.min(x, targetWidth)),
                                y: Math.max(0, Math.min(y, targetHeight))
                            }
                            click(point);
                        }
                    }

                }
            };
        }
    };
});