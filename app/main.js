requirejs.config({
    paths: {
        'text': '../js/text',
        'durandal': '../js/durandal',
        'plugins': '../js/durandal/plugins',
        'transitions': '../js/durandal/transitions'
    }
});

define('knockout', function () { return window.ko; });
define('jquery', function () { return window.jQuery; });
define('Q', function () { return window.Q; });
define('_', function () { return window._; });


define(['durandal/app', 'durandal/viewLocator', 'durandal/system', 'modulesInitializer', 'templateSettings', 'settingsReader', 'bootstrapper', 'translation'],
    function (app, viewLocator, system, modulesInitializer, templateSettings, settingsReader, bootstrapper, translation) {
        app.title = 'easygenerator';

        app.configurePlugins({
            router: true,
            dialog: true,
            http: true
        });

        app.start().then(function () {
            bootstrapper.run();

            var modules = {};

            return readPublishSettings().then(function () {
                return readTemplateSettings().then(function (settings) {
                    return initTemplateSettings(settings).then(function () {
                        return initTranslations(settings).then(function () {
                            modulesInitializer.register(modules);
                            app.setRoot('viewmodels/shell');
                        });
                    });
                });
            }).catch(function (e) {
                console.error(e);
            });

            function readPublishSettings() {
                return settingsReader.readPublishSettings().then(function (settings) {
                    _.each(settings.modules, function (module) {
                        modules['../includedModules/' + module.name] = true;
                    });
                });
            }

            function readTemplateSettings() {
                return settingsReader.readTemplateSettings();
            }

            function initTemplateSettings(settings) {
                return templateSettings.init(settings).then(function () {
                    modules['xApi/xApiInitializer'] = templateSettings.xApi;
                });
            }

            function initTranslations(settings) {
                return translation.init(settings.languages.selected, settings.languages.customTranslations);
            }
        });
    }
);