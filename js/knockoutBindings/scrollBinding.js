ko.bindingHandlers.scroll = {
    init: function (element, valueAccessor) {
        var options = valueAccessor();

        if (!options.enabled) {
            return;
        }

        if (!!options.loadFunc) {
            options.loadFunc();
        }

        ko.utils.domNodeDisposal.addDisposeCallback(element, disableEvent);
    },

    update: function (element, valueAccessor) {
        var options = valueAccessor();

        if (!options.enabled || !_.isFunction(options.loadFunc)) {
            disableEvent();
            return;
        }

        if (!options.offset) {
            options.offset = 0;
        }

        enableEvent(options.offset, options.loadFunc);
    }
};

function enableEvent(offset, callback) {
    $(window).on("scroll.ko.scrollHandler", function () {
        if (($(document).height() - offset <= $(window).height() + $(window).scrollTop())) {
            callback();
        }
    });
}

function disableEvent() {
    $(window).off("scroll.ko.scrollHandler");
}