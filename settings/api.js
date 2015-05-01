(function () {
    var apiData = {
        isInited: false
    };

    var
        baseUrl = location.protocol + '//' + location.host,
        identifyUrl = baseUrl + '/api/identify',
        settingsUrl = baseUrl + '/api/course/' + getURLParameter('courseId') + '/template/' + getURLParameter('templateId'),

        templateUrl = location.toString().substring(0, location.toString().indexOf('/settings/')) + '/',
        manifestUrl = templateUrl + 'manifest.json';//TODO: Change way of resolving manifest file path

    window.egApi = {
        init: init,
        getManifest: getManifest,
        getUser: getUser,
        getSettings: getSettings,
        saveSettings: saveSettings,
        sendNotificationToEditor: sendNotificationToEditor
    };

    function init() {
        //Mock for debugging
        var userDataPromise = $.Deferred().resolve([{ subscription: { accessType: 1, expirationDate: new Date(2016, 1, 1) } }]);
        var settingsPromise = $.getJSON('../../settings.js').then(function (response) { return [{ settings: JSON.stringify(response) }]; });
        var manifestPromise = $.getJSON(manifestUrl);

        //var userDataPromise = $.ajax({
        //    url: identifyUrl,
        //    cache: false,
        //    type: 'POST',
        //    contentType: 'application/json',
        //    dataType: 'json'
        //});

        //var settingsPromise = $.ajax({
        //    url: settingsUrl,
        //    cache: false,
        //    contentType: 'application/json',
        //    dataType: 'json'
        //});

        //var manifestPromise = $.ajax({
        //    url: manifestUrl,
        //    cache: false,
        //    contentType: 'application/json',
        //    dataType: 'json'
        //});

        return $.when(manifestPromise, userDataPromise, settingsPromise).done(function (manifestResponse, userDataResponse, settingsResponse) {
            apiData.manifest = getManifestModel(manifestResponse[0]);
            apiData.user = getUserModel(userDataResponse[0]);
            apiData.settings = getSettingsModel(settingsResponse[0]);
            apiData.isInited = true;
        });
    }

    function isInitedGuard() {
        if (!apiData.isInited) {
            throw "Sorry, but you've tried to use api before it was initialized";
        }
    }

    function getManifest() {
        isInitedGuard();
        return apiData.manifest;
    }

    function getUser() {
        isInitedGuard();
        return apiData.user;
    }

    function getSettings() {
        isInitedGuard();
        return apiData.settings;
    }

    function getManifestModel(manifestData) {
        if (manifestData && manifestData.languages && manifestData.languages.length > 0) {
            for (var i = 0; i < manifestData.languages.length; i++) {
                manifestData.languages[i].url = templateUrl + manifestData.languages[i].url;
            }
        }

        return manifestData;
    }

    function getUserModel(userData) {
        var user = { accessType: 0 };
        var starterAccessType = 1;
        if (userData.subscription &&
            userData.subscription.accessType &&
            userData.subscription.accessType >= starterAccessType &&
            new Date(userData.subscription.expirationDate) >= new Date()
           ) {
            user.accessType = userData.subscription.accessType;
        }
        return user;
    }

    function getSettingsModel(settingsData) {
        var settings;
        if (settingsData.settings && settingsData.settings.length > 0) {
            settings = JSON.parse(settingsData.settings);
        } else {
            //TODO: need to be removed in next implementation
            settings = {
                logo: {},
                xApi: {
                    enabled: true,
                    selectedLrs: 'default',
                    lrs: {
                        credentials: {}
                    }
                },
                masteryScore: {}
            };
        }
        return settings;
    }


    function getURLParameter(name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
    }

    function saveSettings(settings, extraSettings, successSaveMessage, failSaveMessage) {
        freezeEditor();

        return $.post(settingsUrl, { settings: settings, extraSettings: extraSettings })
            .done(function () {
                sendNotificationToEditor(successSaveMessage, true);
            })
            .fail(function () {
                sendNotificationToEditor(failSaveMessage, false);
            })
            .always(function () {
                unfreezeEditor();
            });
    }

    function freezeEditor() {
        postMessageToEditor({ type: 'freeze', data: { freezeEditor: true } });
    }

    function unfreezeEditor() {
        postMessageToEditor({ type: 'freeze', data: { freezeEditor: false } });
    }

    function postMessageToEditor(data) {
        var editorWindow = window.top;
        editorWindow.postMessage(data, editorWindow.location.href);
    }

    function sendNotificationToEditor(message, isSuccess) {
        postMessageToEditor({ type: 'notification', data: { success: isSuccess || true, message: message } });
    }

})();