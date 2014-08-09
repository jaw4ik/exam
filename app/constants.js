define([], function () {
    "use strict";

    var constants = {};

    constants.question = {
        types: {
            multipleSelect: 'multipleSelect',
            fillInTheBlanks: 'fillInTheBlank',
            dragAndDropText: 'dragAndDropText',
            singleSelectText: 'singleSelectText',
            singleSelectImage: 'singleSelectImage'
        }
    }

    return constants;
});