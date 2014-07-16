define(function () {
    "use strict";

    return {
        execute: function () {
            ko.bindingHandlers.fillInTheBlankAnswers = {
                update: function (element, valueAccessor) {

                    var
                        blankInputSelector = '.blankInput',

                        $blanksHolder = $(element),
                        blankValues = valueAccessor(),

                        $blankItems = $(blankInputSelector, $blanksHolder);

                    $blankItems.each(function (index, element) {
                        var
                            $element = $(element),
                            groupId = $element.data('group-id'),
                            blankValue = _.find(blankValues, function (blank) {
                                return blank.groupId === groupId;
                            });

                        $element.val(blankValue.value);

                        $element.on('blur', function () {
                            blankValue.value = $element.val().trim();
                        });
                    });
                }
            };
        }
    };

});