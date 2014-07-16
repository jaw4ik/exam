define([], function () {

    return {
        throwIfNotAnObject: function (obj, message) {
            if (!_.isObject(obj)) {
                throw message;
            }
        },

        throwIfNotString: function (str, message) {
            if (!_.isString(str)) {
                throw message;
            }
        },

        throwIfNotBoolean: function (bool, message) {
            if (!_.isBoolean(bool)) {
                throw message;
            }
        },

        throwIfNotArray: function (array, message) {
            if (!_.isArray(array)) {
                throw message;
            }
        },

        throwIfNotDate: function (date, message) {
            if (!_.isDate(date)) {
                throw message;
            }
        },

        throwIfNotNumber: function (number, message) {
            if (!_.isNumber(number)) {
                throw message;
            }
        }
    };

});