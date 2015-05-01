(function () {
    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();
            $(element).toggle(ko.unwrap(value));
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            if (ko.unwrap(value)) {
                $(element).fadeIn();
            } else {
                $(element).fadeOut();
            }
        }
    };

    ko.bindingHandlers.localize = {
        init: function (element, valueAccessor) {
            var $element = $(element),
                key = ko.unwrap(valueAccessor());

            $element.html(app.localize(key));
        }
    };

    ko.bindingHandlers.background = {
        init: function (element) {
            $(element)
                .css('background-size', 'cover')
                .css('background-position', 'center')
                .css('background-repeat', 'no-repeat');
        },
        update: function (element, valueAccessor) {
            var src = ko.unwrap(valueAccessor());

            $(element).css('background-image', 'none');

            if (src) {
                var image = new Image();
                image.onload = function () {
                    $(element).css('background-image', 'url(' + src + ')')
                };
                image.src = src;
            }
        }
    };
})();
