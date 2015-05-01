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
})();
