define(['translationsReader'], function (translationsReader) {
    var translations = [];
    var defaultTranslationsCode = 'en';

    function init(languageCode, customTranslations) {
        console.log('init  translation');
        return readDefaultTranslations().then(function (defaultTranslations) {
            return resolveTranslations(languageCode, customTranslations).then(function (resolvedTranslations) {
                translations = _.defaults(resolvedTranslations, defaultTranslations);
            });
        });
    }

    function readDefaultTranslations() {
        return translationsReader.readTranslations(defaultTranslationsCode);
    }

    function resolveTranslations(languageCode, customTranslations) {
        if (!languageCode || languageCode === defaultTranslationsCode) {
            return $.Deferred().resolve([]).promise();
        }
        if (languageCode === 'xx') {
            return $.Deferred().resolve(customTranslations).promise();
        }
        return translationsReader.readTranslations(languageCode);
    }

    function getTextByKey(key) {
        if (typeof translations[key] != "string") {
            throw 'Unable to localize ' + key;
        }
        return _.unescape(translations[key]);
    }

    return {
        init: init,
        getTextByKey: getTextByKey
    }
})