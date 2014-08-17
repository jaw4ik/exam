define(['knockout'], function (ko) {
    "use strict";

    return {
        execute: function () {

            ko.bindingHandlers.thumbnail = {
                init: function (element, valueAccessor) {
                    var
                        value = valueAccessor(),
                        src = ko.utils.unwrapObservable(value)
                    ;

                    $(element).addClass('preview-thumbnail-wrapper');

                    var previewThumbnail = $('<div />')
                            .addClass('preview-thumbnail')
                            .appendTo(element);

                    var image = new Image();
                    image.onload = function () {
                        previewThumbnail.css({
                            'background-image': 'url(' + src + ')',
                            'background-size': (this.width > $(element).width() && this.height > $(element).height()) ? 'cover' : 'auto'
                        });

                        $('<button />')
                            .attr('type', 'button')
                            .addClass('preview-open')
                            .addClass("ontouchstart" in document.documentElement ? 'touch' : '')
                            .click(function (e) {
                                showPreview(src);
                                e.preventDefault();
                                e.stopImmediatePropagation();
                            })
                            .appendTo(element);
                    }
                    image.src = src;

                }
            }

            function showPreview(url) {
                var
                    overlayWrapper = $('<div />')
                        .addClass('preview-overlay-wrapper'),

                    overlay = $('<div>')
                        .addClass('preview-overlay')
                        .appendTo(overlayWrapper),

                    imageOuterWrapper = $('<div />')
                        .addClass('preview-image-outer-wrapper')
                        .appendTo(overlay),

                    imageInnerWrapper = $('<div />')
                        .addClass('preview-image-inner-wrapper')
                        .appendTo(imageOuterWrapper),

                    button = $('<button />')
                        .addClass('preview-close')
                        .on('click', function () {
                            overlayWrapper.animate({
                                opacity: 0
                            }, 200, function () {
                                $(window).off('resize', updatePreviewImageSize);
                                $(window).off('orientationchange', updatePreviewImageSize);
                                overlayWrapper.remove();
                            });
                        })
                        .hide()
                        .appendTo(imageInnerWrapper),

                    image = $('<img />')
                        .addClass('preview-image')
                        .attr('src', url)
                        .on('load', function () {
                            button.show();
                        })
                        .appendTo(imageInnerWrapper)
                ;

                function updatePreviewImageSize() {
                    var browserWidth = $(window).innerWidth();
                    var browserHeight = $(window).innerHeight();

                    image.css('maxWidth', browserWidth - 50 + 'px').css('maxHeight', browserHeight - 50 + 'px');
                }

                function closePreviewOnEsc(e) {
                    if (e.keyCode == 27) {
                        button.trigger('click');
                        $(window).off('keypress', closePreviewOnEsc);
                    }
                }

                $(window).on('resize orientationchange', updatePreviewImageSize);
                $(window).on('keypress', closePreviewOnEsc);
                updatePreviewImageSize();

                overlayWrapper
                    .appendTo($('body'))
                    .animate({
                        opacity: 1
                    }, 200);
            }

        }
    };
});