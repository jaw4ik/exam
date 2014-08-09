define([], function () {

    return {
        show: function (url) {
            var
                overlayWrapper = $('<div />')
                    .addClass('preview-overlay-wrapper'),

                overlay = $('<div>')
                    .addClass('preview-overlay')
                    .appendTo(overlayWrapper),

                imageWrapper = $('<div />')
                    .addClass('preview-image-wrapper')
                    .appendTo(overlay),

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
                    .appendTo(imageWrapper),

                image = $('<img />')
                    .addClass('preview-image')
                    .attr('src', url)
                    .on('load', function () {
                        button.show();
                    })
                    .appendTo(imageWrapper)
            ;            

            function updatePreviewImageSize() {
                var browserWidth = $(window).innerWidth();
                var browserHeight = $(window).innerHeight();

                image.css('maxWidth', browserWidth - 50 + 'px').css('maxHeight', browserHeight - 50 + 'px');
            }

            $(window).on('resize orientationchange', updatePreviewImageSize);
            updatePreviewImageSize();

            overlayWrapper
                .appendTo($('body'))
                .animate({
                    opacity: 1
                }, 200);
        }
    }

})