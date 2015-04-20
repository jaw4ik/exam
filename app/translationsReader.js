define(['jsonReader', 'manifestReader'], function (jsonReader, manifestReader) {

    var translations = {};

    function readTranslations(code) {
        var def = $.Deferred();

        if (translations[code]) { //from cache
            def.resolve(translations[code]);
        } else {
            manifestReader.readManifest().then(function (manifest) {
                var lang = _.find(manifest.languages, function (item) {
                    return item.code === code;
                });
                if (lang) {
                    jsonReader.read(lang.url).then(function (resultTranslations) {
                        translations[lang.code] = resultTranslations; //fill cache
                        def.resolve(translations[lang.code]);
                    });
                } else {
                    throw 'Translations for [' + code + '] not found! Please contact template developer.';
                }
            });
        }
        return def.promise();
    }

    return {
        readTranslations: readTranslations
    };

});