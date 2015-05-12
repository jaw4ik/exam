(function () {
    ko.bindingHandlers.number = {
        init: function (element) {
            var $element = $(element),
                maxValue = 100;
            $element.on('keydown', function (e) {
                var key = e.charCode || e.keyCode || 0;
                return (key == 8 || key == 9 || key == 46 || (key >= 37 && key <= 40) ||
                    (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
            });
            $element.on('keyup', function () {
                if ($(this).val() > maxValue) {
                    $(this).val(maxValue);
                }
            });
        }
    };

    ko.bindingHandlers.disableDragNDrop = {
        init: function (element) {
            $(element).on('dragstart', function (event) {
                event.preventDefault();
            });
        }
    };

    ko.bindingHandlers.spinner = {
        init: function (element, valueAccessor) {
            var masteryScore = valueAccessor();
            $(element).spinner('changing', function (e, newValue) {
                masteryScore(newValue);
            });

        }
    };

    ko.bindingHandlers.switchToggle = {
        init: function (element, valueAccessor) {
            var switchToggle = ko.bindingHandlers.switchToggle,
                viewModel = switchToggle.viewModel(element, valueAccessor),
                value = ko.unwrap(valueAccessor().value());

            viewModel.setInitialValue(value);

            switchToggle.onClick(element, function () {
                viewModel.toggle();

                var currentValue = ko.unwrap(valueAccessor().value());
                valueAccessor().value(!currentValue);
            });
        },
        update: function (element, valueAccessor) {
            var viewModel = ko.bindingHandlers.switchToggle.viewModel(element, valueAccessor),
                value = ko.unwrap(valueAccessor().value());

            viewModel.updateValue(value);
        },
        viewModel: function (element) {
            var $element = $(element),
                $wrapper = $('.switch-toggle-wrapper', $element);

            function setInitialValue(value) {
                setElementValue(value);
                updateElementPosition(value);
            }

            function toggle() {
                var value = getValue();
                setElementValue(!value);

                $wrapper.stop().animate({
                    marginLeft: calculateElementLeftMargin(!value)
                }, 250);
            }

            function getValue() {
                return $element.hasClass('on');
            }

            function updateValue(value) {
                if (getValue() != value) {
                    setInitialValue(value);
                }
            }

            function setElementValue(value) {
                $element.toggleClass('on', value);
                $element.toggleClass('off', !value);
            }

            function updateElementPosition(value) {
                $wrapper.css('margin-left', calculateElementLeftMargin(value) + 'px');
            }

            function calculateElementLeftMargin(value) {
                return value ? 0 : $element.height() - $element.width();
            }

            return {
                setInitialValue: setInitialValue,
                updateValue: updateValue,
                toggle: toggle
            }
        },
        onClick: function (element, handler) {
            var $element = $(element),
                isMouseDownFired = false;

            $element.mousedown(function (event) {
                if (event.which != 1)
                    return;

                isMouseDownFired = true;
                handler();
            });

            $element.click(function () {
                if (isMouseDownFired) {
                    isMouseDownFired = false;
                    return;
                }

                handler();
            });
        }
    };

    ko.bindingHandlers.dropdown = {
        cssClasses: {
            dropdown: 'dropdown',
            disabled: 'disabled',
            expanded: 'expanded',
            optionsList: 'dropdown-options-list',
            optionItem: 'dropdown-options-item',
            currentItem: 'dropdown-current-item',
            currentItemText: 'dropdown-current-item-text',
            indicatorHolder: 'dropdown-indicator-holder',
            indicator: 'dropdown-indicator'
        },
        init: function (element, valueAccessor) {
            var $element = $(element),
                cssClasses = ko.bindingHandlers.dropdown.cssClasses;

            $element.addClass(cssClasses.dropdown);

            var $currentItemElement = $('<div />')
                .addClass(cssClasses.currentItem)
                .appendTo($element);

            $('<div />')
                .addClass(cssClasses.currentItemText)
                .appendTo($currentItemElement);

            var $indicatorHolder = $('<div />')
                .addClass(cssClasses.indicatorHolder)
                .appendTo($currentItemElement);

            $('<span />')
                .addClass(cssClasses.indicator)
                .appendTo($indicatorHolder);

            $('<ul />')
                .addClass(cssClasses.optionsList)
                .appendTo($element);

            $currentItemElement.on('click', function (e) {
                if ($element.hasClass(cssClasses.disabled)) {
                    return;
                }

                $currentItemElement.toggleClass(cssClasses.expanded);
                e.stopPropagation();
            });

            var collapseHandler = function () {
                $currentItemElement.removeClass(cssClasses.expanded);
            };

            $('html').bind('click', collapseHandler);
            $(window).bind('blur', collapseHandler);

            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $('html').unbind('click', collapseHandler);
                $(window).unbind('blur', collapseHandler);
            });
        },
        update: function (element, valueAccessor) {
            var $element = $(element),
                cssClasses = ko.bindingHandlers.dropdown.cssClasses,

                $optionsListElement = $element.find('ul.' + cssClasses.optionsList),
                $currentItemTextElement = $element.find('div.' + cssClasses.currentItemText);


            var options = valueAccessor().options,
                optionsText = valueAccessor().optionsText,
                value = valueAccessor().value,
                optionsValue = valueAccessor().optionsValue,
                currentValue = ko.unwrap(value),
                disable = ko.unwrap(valueAccessor().disable);

            if (disable) {
                $element.toggleClass(cssClasses.disabled);
            } else {
                $element.removeClass(cssClasses.disabled);
            }

            $optionsListElement.empty();

            $.each(options, function (index, option) {
                if (option[optionsValue] == currentValue) {
                    $currentItemTextElement.text(option[optionsText]);
                    return;
                }

                $('<li />')
                    .addClass(cssClasses.optionItem)
                    .appendTo($optionsListElement)
                    .text(option[optionsText])
                    .on('click', function (e) {
                        value(option[optionsValue]);
                        $element.trigger('change');
                    });
            });
        }
    };

    ko.bindingHandlers.tabs = {
        init: function (element) {
            var $element = $(element),
                dataTabLink = 'data-tab-link',
                dataTab = 'data-tab',
                activeClass = 'active',
                $tabLinks = $element.find('[' + dataTabLink + ']'),
                $tabs = $element.find('[' + dataTab + ']');

            $tabs.hide();

            $tabLinks.first().addClass(activeClass);
            $tabs.first().show();

            $tabLinks.each(function (index, item) {
                var $item = $(item);
                $item.on('click', function () {
                    var key = $item.attr(dataTabLink),
                        currentContentTab = $element.find('[' + dataTab + '="' + key + '"]');
                    $tabLinks.removeClass(activeClass);
                    $item.addClass(activeClass);
                    $tabs.hide();
                    currentContentTab.show();
                });
            });

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
