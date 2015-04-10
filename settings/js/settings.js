(function (app) {

    var
        currentSettings = null,
        currentExtraData = null,
        baseURL = location.protocol + '//' + location.host;

    var viewModel = {
        trackingData: null,
        languages: null,
        logo: null,
        
        masteryScore: ko.observable(100),
        userHasStarterPlan: ko.observable(false)
    };

    viewModel.getSettingsData = function () {
        return {
            logo: viewModel.logo.getData(),
            xApi: viewModel.trackingData.getData(),
            languages: viewModel.languages.getData(),
            masteryScore: { score: viewModel.masteryScore() }
        };
    };

    viewModel.getExtraData = function () {
        return {};
    };

    viewModel.saveChanges = function () {
        var settings = viewModel.getSettingsData(),
            extraData = viewModel.getExtraData(),
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
                user = api.getUser(),
                settings = api.getSettings();

            if (user.accessType > 0) {
                viewModel.userHasStarterPlan(true);
            }

            if (settings.masteryScore && settings.masteryScore.score && settings.masteryScore.score >= 0 && settings.masteryScore.score <= 100) {
                viewModel.masteryScore(settings.masteryScore.score);
            }

            viewModel.trackingData = new app.TrackingDataModel(settings.xApi);
            viewModel.languages = new app.LanguagesModel(manifest.languages, settings.languages);
            viewModel.logo = new app.LogoModel(settings.logo);
            
            currentSettings = viewModel.getSettingsData();
            currentExtraData = viewModel.getExtraData();

        }).fail(function () {
            api.sendNotificationToEditor(app.localize('settings are not initialize'), false);
        });
    };

    //#region Image uploader

    function imageUploaderViewModel() {
        var imageUploader = {
            apiUrl: baseURL + '/storage/image/upload',
            maxFileSize: 10, //MB
            supportedExtensions: ['jpeg', 'jpg', 'png', 'bmp', 'gif'],
            somethingWentWrongMessage: { title: 'Something went wrong', description: 'Please, try again' },

            status: {
                'default': function () {
                    viewModel.logo.setDefaultStatus();
                },
                fail: function (reason) {
                    viewModel.logo.setFailedStatus(reason.title, reason.description);
                },
                loading: function () {
                    viewModel.logo.isLoading(true);
                }
            },

            button: {
                enable: function () {
                    this.$input.attr('disabled', false).closest('.image-upload-button').removeClass('disabled');
                },
                disable: function () {
                    this.$input.attr('disabled', true).closest('.image-upload-button').addClass('disabled');
                },
                submit: function () {
                    this.$input[0].form.submit();
                    this.disable();
                    imageUploader.status.loading();
                },
                $input: $('#logoInput')
            },

            init: function () {
                imageUploader.button.$input.on('change', imageUploader.processFile);
                imageUploader.button.enable();
            },

            processFile: function () {
                if (!this.files) {
                    imageUploader.button.submit();
                    return;
                }
                if (this.files.length === 0) {
                    return;
                }

                var file = this.files[0],
                    fileExtension = file.name.split('.').pop().toLowerCase();

                if ($.inArray(fileExtension, imageUploader.supportedExtensions) === -1) {
                    imageUploader.status.fail({ title: 'Unsupported image format', description: '(Allowed formats: ' + imageUploader.supportedExtensions.join(', ') + ')' });
                    return;
                }
                if (file.size > imageUploader.maxFileSize * 1024 * 1024) {
                    imageUploader.status.fail({ title: 'File is too large', description: '(Max file size: ' + imageUploader.maxFileSize + 'MB)' });
                    return;
                }
                imageUploader.uploadFile(file);
            },

            uploadFile: function (file) {
                imageUploader.button.disable();
                imageUploader.status.loading();

                var formData = new FormData();
                formData.append('file', file);

                $.ajax({
                    url: imageUploader.apiUrl,
                    type: 'POST',
                    data: formData,
                    cache: false,
                    dataType: 'json',
                    processData: false, // Don't process the files
                    contentType: false // Set content type to false as jQuery will tell the server its a query string request
                }).done(function (response) {
                    imageUploader.handleResponse(response);
                }).fail(function () {
                    imageUploader.status.fail(imageUploader.somethingWentWrongMessage);
                    imageUploader.button.enable();
                });
            },

            handleResponse: function (response) {
                try {
                    if (!response) {
                        throw 'Response is empty';
                    }

                    if (typeof response != 'object') {
                        response = JSON.parse(response);
                    }

                    if (!response || !response.success || !response.data) {
                        throw 'Request is not success';
                    }

                    viewModel.logo.setUrl(response.data.url);
                    imageUploader.status['default']();
                } catch (e) {
                    imageUploader.status.fail(imageUploader.somethingWentWrongMessage);
                } finally {
                    imageUploader.button.enable();
                }
            }
        }
        return imageUploader;
    }

    //#endregion Image uploader

    viewModel.init().done(function () {
        $(document).ready(function () {
            ko.applyBindings(viewModel, $('.settings-container')[0]);
            if (window.egApi.getUser().accessType > 0) {
                var imageUploader = new imageUploaderViewModel();
                imageUploader.init();
            }

            $(window).on('blur', viewModel.saveChanges);
        });
    });

})(window.app = window.app || {});