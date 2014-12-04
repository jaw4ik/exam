define(['models/templateSettings'], function (TemplateSettings) {

    var ticks = new Date().getTime();

    function readTemplateSettings() {
        return read('settings.js')
            .then(function (result) {
                return new TemplateSettings(result);
            });
    }

    function readPublishSettings() {
        return read('publishSettings.js');
    }

    function read(filename) {
        var defer = Q.defer();
        $.getJSON(filename).then(function (json) {
            defer.resolve(json);
        }).fail(function () {
            defer.resolve({});
        });

        return defer.promise;
    }

    return {
        readTemplateSettings: readTemplateSettings,
        readPublishSettings: readPublishSettings
    };

});