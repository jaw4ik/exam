(function (app) {

    var
        currentSettings = null,
        currentExtraData = null;

    var viewModel = {
        isError: ko.observable(false),

        trackingData: null,
        masteryScore: null,
        languages: null
    };

    viewModel.getCurrentSettingsData = function (settings) {
        return $.extend({}, settings || currentSettings, {
            xApi: viewModel.trackingData.getData(),
            masteryScore: viewModel.masteryScore.getData(),
            languages: viewModel.languages.getData()
        });
    };

    viewModel.getCurrentExtraData = function () {
        return {};
    };

    viewModel.saveChanges = function () {
        var settings = viewModel.getCurrentSettingsData(),
            extraData = viewModel.getCurrentExtraData(),
            newSettings = JSON.stringify(settings),
            newExtraData = JSON.stringify(extraData);

        if (JSON.stringify(currentSettings) === newSettings && JSON.stringify(currentExtraData) === newExtraData) {
            return;
        }

        window.egApi.saveSettings(newSettings, newExtraData, app.localize('changes are saved'), app.localize('changes are not saved'))
            .done(function () {
                currentSettings = settings;
                currentExtraData = extraData;
            });
    };

    viewModel.init = function () {
        var api = window.egApi;
        return api.init().then(function () {
            var manifest = api.getManifest(),
                settings = api.getSettings();

            viewModel.trackingData = new app.TrackingDataModel(settings.xApi);
            viewModel.masteryScore = new app.MasteryScore(settings.masteryScore);
            viewModel.languages = new app.LanguagesModel(manifest.languages, settings.languages);

            currentSettings = viewModel.getCurrentSettingsData(settings);
            currentExtraData = viewModel.getCurrentExtraData();

        }).fail(function () {
            viewModel.isError(true);
        });
    };

    viewModel.init().always(function () {
        $(document).ready(function () {
            ko.applyBindings(viewModel, $('.settings-container')[0]);
            $(window).on('blur', viewModel.saveChanges);
        });
    });

})(window.app = window.app || {});
