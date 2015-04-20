define(['jsonReader'], function (jsonReader) {

    function readTemplateSettings() {
        return jsonReader.read('settings.js');
    }

    function readPublishSettings() {
        return jsonReader.read('publishSettings.js');
    }

    return {
        readTemplateSettings: readTemplateSettings,
        readPublishSettings: readPublishSettings
    };

});