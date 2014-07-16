define([], function () {
    "use strict";

    var constants = {};

    constants.question = {
        types: {
            multipleSelect: 0,
            fillInTheBlanks: 1,
            dragAndDropText: 2,
            singleSelectText: 3
        }
    }

    return constants;
});