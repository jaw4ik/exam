define(['./constants'],
    function (constants) {

        var
            mailRegex = /^([\w\.\-]+)@([\w\-]+)((\.(\w){2,6})+)$/,
            isoDurationRegex = /^PT[0-9]{1,2}H[0-9]{1,2}M[0-9]{1,2}S$/,

            throwIfNotISODuration = function (duration, message) {
                if (!_.isString(duration)) {
                    throw message;
                }

                if (!isoDurationRegex.test(duration)) {
                    throw message;
                }
            },

            throwIfNotMbox = function (mbox, message) {
                if (!_.isString(mbox)) {
                    throw message;
                }

                if (mbox.indexOf('mailto:') == -1) {
                    throw message;
                }

                try {
                    throwIfNotEmail(mbox.split('mailto:')[1]);
                } catch (e) {
                    throw message;
                }
            },

            throwIfNotEmail = function (email, message) {
                if (!_.isString(email)) {
                    throw message;
                }

                if (!mailRegex.test(email)) {
                    throw message;
                }
            },

            throwIfNotLanguageMap = function (display, message) {
                if (!_.isObject(display)) {
                    throw message;
                }

                for (var locale in display) {
                    if (!_.isString(display[locale])) {
                        throw message;
                    }
                }
            },

            throwIfNotVerbId = function (id, message) {
                if (!_.isString(id)) {
                    throw message;
                }

                var isVerIdValid = false;
                for (var verb in constants.verbs) {
                    if (constants.verbs[verb].id === id) {
                        isVerIdValid = true;
                        break;
                    }
                }

                if (!isVerIdValid) {
                    throw message;
                }
            },

            throwIfNotString = function (text, message) {
                if (!_.isString(text)) {
                    throw message;
                }
            },

            throwIfNotAnObject = function (item, message) {
                if (!_.isObject(item)) {
                    throw message;
                }
            },

            throwIfNotNumber = function (item, message) {
                if (!_.isNumber(item)) {
                    throw message;
                }
            };

        return {
            throwIfNotMbox: throwIfNotMbox,
            throwIfNotEmail: throwIfNotEmail,
            throwIfNotLanguageMap: throwIfNotLanguageMap,
            throwIfNotVerbId: throwIfNotVerbId,
            throwIfNotString: throwIfNotString,
            throwIfNotAnObject: throwIfNotAnObject,
            throwIfNotNumber: throwIfNotNumber,
            throwIfNotISODuration: throwIfNotISODuration
        };
    }
);