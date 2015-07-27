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
    };

    constants.localStorageResultKey = 'course_result';

    constants.course = {
        statuses: {
            completed: 'completed',
            failed: 'failed',
            inProgress: 'inProgress'
        }
    };

    return constants;
});