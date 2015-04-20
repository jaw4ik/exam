define(['translation'], function (translation) {
    return {
        localize: function () {
            $('[data-translate-text]').each(function () {
                var key = $(this).attr('data-translate-text');
                $(this).text(translation.getTextByKey(key));
            });
            $('[data-translate-placeholder]').each(function () {
                var key = $(this).attr('data-translate-placeholder');
                $(this).attr("placeholder", translation.getTextByKey(key));
            });
            $('[data-translate-title]').each(function () {
                var key = $(this).attr('data-translate-title');
                $(this).attr("title", translation.getTextByKey(key));
            });
        }
    }
})