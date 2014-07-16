ko.bindingHandlers.focusHandler = {
    init: function () {
    },

    update: function () {

        var elem = '.xapi-form-input',
            wrapper = elem + '-wrapper';

        $(elem).focusin(function () {
        }).blur(function () {
        }).focusin();

        $(wrapper).click(function () {
            if ($(this).parent().find(elem).is(':focus')) {
                $(this).bind('click mousedown mouseup', function () {
                    return false;
                });
            } else {
                $(this).bind('click mousedown mouseup', function () {
                    return false;
                }).parent().find(elem).focus();
            }
        });

        $(elem).hover(function () {
            $(this).parent().find(wrapper).toggleClass('hover');
        });

        $(elem).focusin(function () {
            $(this).parent().find(wrapper).addClass('focus');
        });
        $(elem).blur(function () {
            $(this).parent().find(wrapper).removeClass('focus');
        });
    }
};