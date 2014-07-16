(function () {
    "use strict";
    if (typeof (_) !== "function") {
        throw new Error("underscore not found.");
    }

    _.isEmptyOrWhitespace = function (obj) {
        if (!_.isString(obj))
            throw new TypeError;

        return _.isEmpty(obj.trim());
    };

    _.isNullOrUndefined = function (obj) {
        return _.isUndefined(obj) || _.isNull(obj);
    };

    _.isEmptyHtmlText = function (obj) {
        var removeTagsRegex = /<\s*p?|(div)?\s*>(\s|&nbsp;|<\/?\s?br\s?\/?>)*<\s*\/p?|(div)?\s*>|<\s*p?|(div)?\s*\/>|(\s|&nbsp;|<\/?\s?br\s?\/?>)*/g;
        var textWithoutTagsAndWhiteSpace = obj.replace(removeTagsRegex, '').trim();
        return _.isEmpty(textWithoutTagsAndWhiteSpace);
    };

})();