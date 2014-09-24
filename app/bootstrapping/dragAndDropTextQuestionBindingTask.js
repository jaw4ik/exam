define([], function () {
    "use strict";

    return {
        execute: function () {
            ko.bindingHandlers.overlay = {
                update: function (element, valueAccessor) {
                    var value = valueAccessor();
                    if (ko.utils.unwrapObservable(value)) {
                        $(element).addClass('overlay-wrapper');
                        $('<div />').addClass('overlay').appendTo(element);
                    } else {
                        $(element).removeClass('overlay-wrapper');
                        $(element).children('.overlay').remove();
                    }
                }
            }

            ko.bindingHandlers.background = {
                init: function (element) {
                    $(element)
                        .css('background-position', '0 0')
                        .css('background-repeat', 'no-repeat');
                },
                update: function (element, valueAccessor) {
                    var value = valueAccessor();
                    if (value) {
                        var src = ko.utils.unwrapObservable(value);
                        var image = new Image();
                        image.src = src;

                        image.onload = function () {
                            $(element)
                                .css('background-image', 'url(' + src + ')')
                                .css('height', image.height)
                                .css('width', image.width);
                        }
                    }
                }
            }

            ko.bindingHandlers.draggableTextContainer = {
                init: function (element, valueAccessor, allBindingsAccessor) {
                    var allBindings = allBindingsAccessor();
                    var scope = ko.utils.unwrapObservable(allBindings.scope) || 'question';
					
					$(element).parent()
                    .on('dragstart', '.drag-and-drop-text-draggable', function () {
                        $(element).addClass('active');
                    })
                    .on('dragstop', '.drag-and-drop-text-draggable', function () {
                        $(element).removeClass('active');
                        if ($(element).children('.drag-and-drop-text-draggable').length) {
                            $(element).children('.drag-and-drop-text-draggable-container-message').hide();
                        } else {
                            $(element).children('.drag-and-drop-text-draggable-container-message').show();
                        }
                    });
					
                    $(element).droppable({
                        accept: '.drag-and-drop-text-draggable',
                        scope: scope,
                        drop: function (e, ui) {
                            ui.draggable.css('left', '').css('top', '').appendTo(this);
                            var text = ko.dataFor(ui.draggable.get(0));
                            if(text.dropSpot){
                                text.dropSpot.text(undefined);
                            }
                        }
                    });
                }
            }

            ko.bindingHandlers.draggableText = {
                init: function (element, valueAccessor, allBindingsAccessor) {
                    var allBindings = allBindingsAccessor();
                    var scope = ko.utils.unwrapObservable(allBindings.scope) || 'question';
                    var $element = $(element);

                    $element.draggable({
                        scope: scope,
                        revert: 'invalid',
                        helper: 'clone',
                        scroll: false,
                        appendTo: 'body',
                        start: function(){
                            $element.css({visibility:'hidden'});
                        },
                        stop: function(){
                            $element.css({visibility:'visible'});
                        }
                    });
                }
            }


            ko.bindingHandlers.dropspot = {
                init: function (element, valueAccessor, allBindingsAccessor) {
                    var value = valueAccessor();
                    var allBindings = allBindingsAccessor();

                    var left = ko.utils.unwrapObservable(value.x);
                    var top = ko.utils.unwrapObservable(value.y);
                    var scope = ko.utils.unwrapObservable(allBindings.scope) || 'question';

                    $('.ui-draggable')
                        .on('dragstart', function (event, ui) {

                            $(element).addClass('active');

                            if ($(element).children('.drag-and-drop-text-draggable').length) {
                                return;
                            }

                            $(element).width(ui.helper.outerWidth());
                            $(element).height(ui.helper.outerHeight());

                        })
                        .on('dragstop', function (event, ui) {
                            $(element).removeClass('active');
                            $(element).css('width', '');
                            $(element).css('height', '');
                        });

                    $(element).droppable({
                        accept: function (arg) {
                            if ($(element).find(arg).length) {
                                return true;
                            }

                            return $(element).find('.drag-and-drop-text-draggable').length == 0;
                        },
                        tolerance: 'pointer',
                        scope: scope,
                        drop: function (e, ui) {
                            var text = ko.dataFor(ui.draggable.get(0));

                            ui.draggable.css('left', '').css('top', '').appendTo(this);

                            if (ko.isWriteableObservable(value.text)) {
                                value.text(text);
                                text.dropSpot = value;
                            }
                        }
                    });

                    $(element).css('left', left + 'px').css('top', top + 'px');
                },
                update: function (element, valueAccessor) {
                    var value = valueAccessor();
                    var text = ko.utils.unwrapObservable(value.text);

                    if (text) {
                        // I believe it will be used when we have to restore previously saved answer
                    } else {
                        $(element).children('.drag-and-drop-text-draggable').css('left', '').css('top', '').appendTo($('.drag-and-drop-text-draggable-container'));
						$(element).children('.drag-and-drop-text-draggable-container-message').hide();
                    }
                }
            }
        }
    };
});