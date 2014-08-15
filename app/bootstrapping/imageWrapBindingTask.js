define(['durandal/composition'], function (composition) {
    "use strict";

    return {
        execute: function () {
            ko.bindingHandlers.imageWrap = {
                init: function (element) {
                    var $element = $(element),
                        wrapper = '<figure class="image-wrapper"></figure>';

                    $('img', $element).wrap(wrapper);
                }
            };
            composition.addBindingHandler('imageWrap');
        }
    };

});