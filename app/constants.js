define([], function () {
    "use strict";

    var constants = {};

    constants.question = {
        types: {
            multipleSelect: 'multipleSelect',
            fillInTheBlanks: 'fillInTheBlank',
            dragAndDropText: 'dragAndDropText',
            singleSelectText: 'singleSelectText',
            singleSelectImage: 'singleSelectImage',
            textMatching: 'textMatching',
            statement: 'statement'
        }
    }

    return constants;
});