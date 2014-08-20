define(function () {
    "use strict";

    var blankInputSelector = '.blankInput,.blankSelect',
        placeHolder = 'Choose the answer...';

    return {
        execute: function () {
            ko.bindingHandlers.fillInTheBlankAnswers = {
                init: function (element, valueAccessor) {
                    var
                        $element = $(element),
                        htmlContent = valueAccessor().content,
                        blankValues = valueAccessor().values,
                        onValuesUpdatedHandler = valueAccessor().onValuesUpdated;

                    $element.html(htmlContent);

                    $(blankInputSelector, $element).each(function (index, blankItem) {
                        var
                            $blankItem = $(blankItem),
                            blankId = $blankItem.data('group-id'),
                            blankValue = _.find(blankValues, function (blank) {
                                return blank.id == blankId;
                            });

                        if ($blankItem.is('input')) {
                            createInput($blankItem, blankValue, onValuesUpdatedHandler);
                        } else if ($blankItem.is('select')) {
                            createDropdown($blankItem, blankValue, element, onValuesUpdatedHandler);
                        }
                    });
                }
            };

            var cssClasses = {
                customSelect: 'custom-select',
                currentSelectedItemText: 'current-selected-item-text',
                currentSelectedItemTextPlaceholder: 'current-selected-item-text-placeholder',
                pointerWrapper: 'pointer-wrapper',
                pointer: 'pointer',
                selectList: 'select-list',
                listItem: 'select-list-item',
                expanded: 'expanded',
                active: 'active',
                selected: 'selected'
            };

            function createInput($blankItem, blankValue, onValuesUpdatedHandler) {
                $blankItem.addClass(cssClasses.customInput);
                $blankItem.val(blankValue.value);
                $blankItem.on('blur', function () {
                    blankValue.value = $blankItem.val().trim();
                    if (_.isFunction(onValuesUpdatedHandler)) {
                        onValuesUpdatedHandler();
                        blankValue.isAnswered(true);
                    }
                });
            }

            function createDropdown($element, blankValue, blanksHolder, onValuesUpdatedHandler) {
                var
                    answerLength = blankValue.answers.length,
                    $selectedItem = null,
                    $customSelect,
                    $currentSelectedItemText,
                    $answerOptionList,
                    $pointerWrapper,
                    $listItems,
                    isIE = (/msie|trident.*rv\:11\./i.test(navigator.userAgent.toLowerCase())),
                    maxWidth = 300,
                    minWidth = 100,
                    KEY_DOWN = 40,
                    KEY_UP = 38,
                    KEY_ENTER = 13,
                    KEY_TAB = 9,
                    elementWidth = $element.width();

                function scrollOption($option) {
                    if (_.isNullOrUndefined($option)) {
                        return;
                    }
                    var menuHeight = $answerOptionList.height(),
                        itemHeight = $option.outerHeight(true),
                        scroll = $answerOptionList.scrollTop() || 0,
                        y = $option.offset().top - $answerOptionList.offset().top + scroll,
                        scrollTop = y,
                        scrollBottom = y - menuHeight + itemHeight;

                    if (y + itemHeight > menuHeight + scroll) {
                        $answerOptionList.stop().animate({ scrollTop: scrollBottom }, 0);
                    } else if (y < scroll) {
                        $answerOptionList.stop().animate({ scrollTop: scrollTop }, 0);
                    }
                }

                function clearSelectedClass() {
                    $('.' + cssClasses.selected, $answerOptionList).removeClass(cssClasses.selected);
                }

                function changeSelectedItem($option, keyCode) {
                    clearSelectedClass();
                    $option.addClass(cssClasses.selected);
                    $selectedItem = $option;
                    blankValue.value = $option.text();
                    if (_.isFunction(onValuesUpdatedHandler)) {
                        onValuesUpdatedHandler();
                    }
                    changeCurrentSelectedItem();
                    scrollOption($option, keyCode);
                }

                function changeCurrentSelectedItem() {
                    $currentSelectedItemText.text($selectedItem.text()).data('index', $listItems.index($selectedItem));
                }

                function getPreviousOption() {
                    if (_.isNullOrUndefined($selectedItem)) {
                        $selectedItem = $($listItems[0]);
                        return $selectedItem;
                    }
                    var $prevOption = $selectedItem.prev();
                    if ($prevOption.length == 0) {
                        $prevOption = $($listItems[answerLength - 1]);
                    }
                    return $prevOption;
                }

                function getNextOption() {
                    if (_.isNullOrUndefined($selectedItem)) {
                        $selectedItem = $($listItems[0]);
                        return $selectedItem;
                    }
                    var $nextOption = $selectedItem.next();
                    if ($nextOption.length == 0) {
                        $nextOption = $($listItems[0]);
                    }
                    return $nextOption;
                }

                function enterKey() {
                    if ($customSelect.hasClass(cssClasses.expanded)) {
                        blankValue.value = $selectedItem.text();
                    }
                    $customSelect.toggleClass(cssClasses.expanded);
                }

                function getWidth() {
                    var width = elementWidth < minWidth ? minWidth : elementWidth > maxWidth ? maxWidth : elementWidth;
                    var paddings = parseInt($currentSelectedItemText.css('padding-left'), 10) + parseInt($currentSelectedItemText.css('padding-right'), 10);
                    return width + paddings;
                }

                var handlers = {
                    keydownHandler: function (evt) {
                        var keyCode = evt.keyCode || evt.which;
                        switch (keyCode) {
                            case KEY_TAB:
                                enterKey();
                                if ($customSelect.hasClass(cssClasses.active)) {
                                    $customSelect.removeClass(cssClasses.active);
                                }
                                break;
                            case KEY_ENTER:
                                enterKey();
                                break;
                            case KEY_UP:
                                changeSelectedItem(getPreviousOption());
                                evt.preventDefault();
                                break;
                            case KEY_DOWN:
                                changeSelectedItem(getNextOption());
                                evt.preventDefault();
                                break;
                            default:
                                break;
                        }
                    },
                    clickHandler: function () {
                        $customSelect.addClass(cssClasses.active).toggleClass(cssClasses.expanded);

                        if ($selectedItem != null) {
                            changeSelectedItem($selectedItem);
                        }
                    },
                    focusHandler: function () {
                        $customSelect.addClass(cssClasses.active);
                    },
                    blurHandler: function () {
                        $customSelect.removeClass(cssClasses.active).removeClass(cssClasses.expanded);
                    },
                    selectOption: function () {
                        var $option = $(this);
                        $currentSelectedItemText.text($option.text()).data('index', $listItems.index($option));
                        $selectedItem = $option;
                        blankValue.value = $option.text();
                    },
                    outsideClickForIE: function () {
                        var clickHandler = function (event) {
                            var $target = $(event.target);
                            if ($target.closest('.' + cssClasses.customSelect)[0] == $customSelect[0]) {
                                if ($target.hasClass(cssClasses.listItem)) {
                                    $customSelect.removeClass(cssClasses.expanded);
                                }
                                return;
                            }

                            $customSelect.removeClass(cssClasses.expanded).removeClass(cssClasses.active);
                        };

                        $('html').on('click', clickHandler);

                        ko.utils.domNodeDisposal.addDisposeCallback(blanksHolder, function () {
                            $('html').unbind('click', clickHandler);
                        });
                    }
                };

                isIE && handlers.outsideClickForIE();

                $customSelect = $('<div />')
                    .attr('class', $element.attr('class'))
                    .attr('tabindex', 0)
                    .data('group-id', $element.data('group-id'))
                    .addClass(cssClasses.customSelect)
                    .on('click', handlers.clickHandler)
                    .on('focus', handlers.focusHandler)
                    .on('blur', handlers.blurHandler)
                    .on('keydown', handlers.keydownHandler);

                $currentSelectedItemText = $('<span class="' + cssClasses.currentSelectedItemText + '">' + placeHolder + '</span>');

                $pointerWrapper = $('<div class="' + cssClasses.pointerWrapper + '"></div');

                $pointerWrapper.append($('<span class="' + cssClasses.pointer + '"></span>'));

                $answerOptionList = $('<ul class="' + cssClasses.selectList + '"></ul>');

                $('option', $element).each(function (index, option) {
                    var $option = $(option);
                    $('<li class="' + cssClasses.listItem + '" title="' + $option.val() + '"></li>')
                    .text($option.val())
                    .appendTo($answerOptionList)
                    .on('click', handlers.selectOption);
                });

                $listItems = $('.' + cssClasses.listItem, $answerOptionList);

                $customSelect.append($currentSelectedItemText).append($pointerWrapper).append($answerOptionList);

                $element.replaceWith($customSelect);
                $currentSelectedItemText.width(getWidth());
            }
        }
    };
});