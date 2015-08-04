(function () {
    var apiData = {
        isInited: false
    };

    var
        baseUrl = location.protocol + '//' + location.host,
        identifyUrl = baseUrl + '/auth/identity',
        settingsUrl = baseUrl + '/api/course/' + getURLParameter('courseId') + '/template/' + getURLParameter('templateId'),

        templateUrl = location.toString().substring(0, location.toString().indexOf('/settings/')) + '/',
        manifestUrl = templateUrl + 'manifest.json', //TODO: Change way of resolving manifest file path

        headers = { 'Authorization': 'Bearer ' + (getURLParameter('token') || localStorage['token.settings']) }
    ;

    window.egApi = {
        init: init,
        getManifest: getManifest,
        getUser: getUser,
        getSettings: getSettings,
        saveSettings: saveSettings,
        sendNotificationToEditor: sendNotificationToEditor,
        showSettings: showSettings
    };

    function init() {
        /* DEBUG */
        var userDataPromise = $.Deferred().resolve([{ subscription: { accessType: 1, expirationDate: new Date(2016, 1, 1) } }]);
        var settingsPromise = $.getJSON('../../settings.js').then(function (response) { return [{ settings: JSON.stringify(response) }]; });
        var manifestPromise = $.getJSON(manifestUrl);
        /* END_DEBUG */

        /* RELEASE
        var userDataPromise = $.ajax({
            url: identifyUrl,
            headers: headers,
            cache: false,
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json'
        });

        var settingsPromise = $.ajax({
            url: settingsUrl,
            headers: headers,
            cache: false,
            contentType: 'application/json',
            dataType: 'json'
        });

        var manifestPromise = $.ajax({
            url: manifestUrl,
            headers: headers,
            cache: false,
            contentType: 'application/json',
            dataType: 'json'
        });
        END_RELEASE */

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
        userData = userData.data;
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
        var param = RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || null;
        return param === null ? null : decodeURI(param[1]);
    }

    function saveSettings(settings, extraSettings, successSaveMessage, failSaveMessage) {
        freezeEditor();

        var data = {
            settings: settings,
            extraSettings: extraSettings
        };

        var requestArgs = {
            url: settingsUrl,
            type: 'POST',
            headers: headers,
            cache: false,
            dataType: 'json',
            data: data
        }

        return $.ajax(requestArgs).done(function () {
            sendNotificationToEditor(successSaveMessage, true);
        }).fail(function () {
            sendNotificationToEditor(failSaveMessage, false);
        }).always(function () {
            unfreezeEditor();
        });
    }

    function freezeEditor() {
        postMessageToEditor({ type: 'freeze-editor' });
    }

    function unfreezeEditor() {
        postMessageToEditor({ type: 'unfreeze-editor' });
    }

    function sendNotificationToEditor(message, isSuccess) {
        postMessageToEditor({ type: 'notification', data: { success: isSuccess, message: message } });
    }

    function showSettings() {
        postMessageToEditor({ type: 'show-settings' });
    }

    function postMessageToEditor(data) {
        var editorWindow = window.top;
        editorWindow.postMessage(data, '*');
    }

})();
