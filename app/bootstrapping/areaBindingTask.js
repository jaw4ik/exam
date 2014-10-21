define(['browserSupport'], function (browserSupport) {
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

                        // workaround for specific version of Chrome with next bug:
                        // https://code.google.com/p/chromium/issues/detail?id=423802
                        if (browserSupport.isChromeWithPageCoordsBug) {
                            x -= window.scrollX;
                            y -= window.scrollY;
                        }

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