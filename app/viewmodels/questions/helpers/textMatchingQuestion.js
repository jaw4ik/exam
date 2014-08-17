define(['jquery', 'knockout', '_', 'durandal/composition'], function ($, ko, _, composition) {


    return function (view) {
        var
            handler = function () {
                var height = 0;


                $(view).find('.text-matching-row').each(function () {
                    $(this).find('.text-matching-column').height('auto');
                    $(this).height('auto');

                    if ($(this).height() > height) {
                        height = $(this).height();
                    }
                });
                $(view).find('.text-matching-row, .text-matching-column').each(function () {
                    $(this).height(height);
                });

            },
            debounced = _.debounce(handler, 10);

        $(window).on('resize', debounced);

        ko.utils.domNodeDisposal.addDisposeCallback(view, function () {
            $(window).off('resize', debounced);
        });

        handler();
    }
})