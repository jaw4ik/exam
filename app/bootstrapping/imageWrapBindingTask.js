define(['durandal/composition'], function (composition) {
    "use strict";

    return {
        execute: function () {
            ko.bindingHandlers.imageWrap = {
                update: function (element) {
                    var $element = $(element),
                        imageWrapper = '<figure class="image-wrapper"></figure>';

                    $('img', $element).each(function (index, image) {
                        var $image = $(image),
                            $wrapper = $(imageWrapper).css('float', $image.css('float'));

                        $image.wrap($wrapper);
                    });
                }
            };

            composition.addBindingHandler('imageWrap');
        }
    }
});