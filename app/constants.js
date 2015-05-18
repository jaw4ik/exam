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
            statement: 'statement',
            hotspot: 'hotspot',
            openQuestion: 'openQuestion'
        }
    }

    return constants;
});