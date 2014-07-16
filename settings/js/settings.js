$(function () {
    function getURLParameter(name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
        );
    }

    var
        courseId = getURLParameter('courseId'),
        templateId = getURLParameter('templateId'),

        baseURL = location.protocol + "//" + location.host,
        settingsURL = baseURL + "/api/course/" + courseId + "/template/" + templateId,

        starterAccessType = 1;

    var viewModel = {
        enableXAPI: ko.observable(false),
        lrsUrl: ko.observable(''),
        authenticationRequired: ko.observable(false),
        lapLogin: ko.observable(),
        lapPassword: ko.observable(),
        isSaved: ko.observable(false),
        isFailed: ko.observable(false),

        logo: (function () {
            var logo = {};

            logo.url = ko.observable('').extend({ throttle: 300 });
            logo.hasLogo = ko.computed(function () {
                return logo.url() !== '';
            });
            logo.clear = function () {
                logo.url('');
            };
            logo.isError = ko.observable(false);
            logo.errorText = ko.observable('');
            logo.errorDescription = ko.observable('');
            logo.isLoading = ko.observable(false);

            return logo;
        })(),

        hasStarterPlan: ko.observable(true),
        statements: {
            started: ko.observable(true),
            stopped: ko.observable(true),
            mastered: ko.observable(true),
            answered: ko.observable(true),
            passed: ko.observable(true),
            failed: ko.observable(true)
        },
        masteryScore: ko.observable('')
    };

    viewModel.credentialsEnabled = ko.computed(function () {
        return viewModel.enableXAPI() && viewModel.authenticationRequired();
    });

    viewModel.saveChanges = function () {
        var settings = {
            logo: {
                url: viewModel.logo.url()
            },
            xApi: {
                enabled: viewModel.enableXAPI(),
                lrs: {
                    uri: viewModel.lrsUrl(),
                    authenticationRequired: viewModel.authenticationRequired(),
                    credentials: {
                        username: viewModel.lapLogin(),
                        password: viewModel.lapPassword()
                    }
                },
                allowedVerbs: $.map(viewModel.statements, function (value, key) {
                    return value() ? key : undefined;
                })
            },
            masteryScore: {
                score: viewModel.masteryScore()
            }
        };

        viewModel.isFailed(false);
        viewModel.isSaved(false);

        $.post(settingsURL, { settings: JSON.stringify(settings) })
            .done(function () {
                viewModel.isSaved(true);
            })
            .fail(function () {
                viewModel.isFailed(true);
            });
    };

    //#region Binding handlers

    ko.bindingHandlers.fadeVisible = {
        init: function (element, valueAccessor) {
            var value = valueAccessor();
            $(element).toggle(ko.unwrap(value));
        },
        update: function (element, valueAccessor) {
            var value = valueAccessor();
            if (ko.unwrap(value)) {
                $(element).fadeIn();
            } else {
                $(element).fadeOut();
            }
        }
    };

    ko.bindingHandlers.number = {
        init: function (element) {
            var $element = $(element),
                maxValue = 100;
            $element.on('keydown', function (e) {
                var key = e.charCode || e.keyCode || 0;
                return (key == 8 || key == 9 || key == 46 || (key >= 37 && key <= 40) ||
                        (key >= 48 && key <= 57) || (key >= 96 && key <= 105));
            });
            $element.on('keyup', function () {
                if ($(this).val() > maxValue) {
                    $(this).val(maxValue);
                }
            });
        }
    };

    ko.bindingHandlers.disableDragNDrop = {
        init: function (element) {
            $(element).on('dragstart', function (event) {
                event.preventDefault();
            });
        }
    };

    ko.bindingHandlers.spinner = {
        init: function (element, valueAccessor) {
            var masteryScore = valueAccessor();

            $(element)
                .spinner('changed', function (e, newValue) {
                    masteryScore(newValue);
                });

        }
    };

    //#endregion Binding handlers

    ko.applyBindings(viewModel, $("#settingsForm")[0]);

    //#region Image uploader

    var imageUploader = {
        apiUrl: baseURL + '/storage/image/upload',
        maxFileSize: 10, //MB
        supportedExtensions: ['jpeg', 'jpg', 'png', 'bmp', 'gif'],
        somethingWentWrongMessage: { title: 'Something went wrong', description: 'Please, try again' },

        status: {
            default: function () {
                viewModel.logo.isLoading(false);
                viewModel.logo.isError(false);
            },
            fail: function (reason) {
                viewModel.logo.clear();
                viewModel.logo.isLoading(false);
                viewModel.logo.errorText(reason.title);
                viewModel.logo.errorDescription(reason.description);
                viewModel.logo.isError(true);
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

        initFrame: function () {
            $('#logoForm').attr('action', imageUploader.apiUrl);
            $('#logoFrame').on('readystatechange', function () {
                if (this.readyState != "complete") {
                    return;
                }

                try {
                    var response = this.contentDocument.body.innerHTML;
                    imageUploader.handleResponse(response);
                } catch (e) {
                    imageUploader.status.fail(imageUploader.somethingWentWrongMessage);
                    imageUploader.button.enable();
                }
            });
        },

        init: function () {
            if (window.top.navigator.userAgent.match(/MSIE 9/i)) {
                imageUploader.initFrame();
            }

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
            formData.append("file", file);

            $.ajax({
                url: imageUploader.apiUrl,
                type: 'POST',
                data: formData,
                cache: false,
                dataType: 'json',
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
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
                    throw "Response is empty";
                }

                if (typeof response != "object") {
                    response = JSON.parse(response);
                }

                if (!response || !response.success || !response.data) {
                    throw "Request is not success";
                }

                viewModel.logo.url(response.data.url);
                imageUploader.status.default();
            } catch (e) {
                imageUploader.status.fail(imageUploader.somethingWentWrongMessage);
            } finally {
                imageUploader.button.enable();
            }
        }
    };

    //#endregion Image uploader

    //#region Ajax requests

    $.ajax({
        cache: false,
        url: settingsURL,
        dataType: "json",
        success: function (json) {
            var settings;
            try {
                settings = JSON.parse(json);
            } catch (e) {
                settings = { logo: {}, xApi: { lrs: { credentials: {} } }, masteryScore: {} };
            }
            viewModel.enableXAPI(settings.xApi.enabled || false);
            viewModel.lrsUrl(settings.xApi.lrs.uri || '');
            viewModel.authenticationRequired(settings.xApi.lrs.authenticationRequired || false);
            viewModel.lapLogin(settings.xApi.lrs.credentials.username || '');
            viewModel.lapPassword(settings.xApi.lrs.credentials.password || '');
            viewModel.logo.url(settings.logo.url || '');
            if (typeof settings.masteryScore != 'undefined' && settings.masteryScore.score >= 0 && settings.masteryScore.score <= 100) {
                viewModel.masteryScore(settings.masteryScore.score);
            } else {
                viewModel.masteryScore(100);
            }

            if (settings.xApi.allowedVerbs) {
                $.each(viewModel.statements, function (key, value) {
                    value($.inArray(key, settings.xApi.allowedVerbs) > -1);
                });
            }
        },
        error: function () {
            viewModel.masteryScore(100);
        }
    });

    $.ajax({
        url: baseURL + '/api/identify',
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        success: function (user) {
            if (user.hasOwnProperty('subscription') && user.subscription.hasOwnProperty('accessType')) {
                var hasStarterAccess = user.subscription.accessType >= starterAccessType && new Date(user.subscription.expirationDate) >= new Date();
                viewModel.hasStarterPlan(hasStarterAccess);

                if (hasStarterAccess) {
                    imageUploader.init();
                }
            } else {
                viewModel.hasStarterPlan(false);
            }
        },
        error: function () {
            viewModel.hasStarterPlan(false);
        }
    });

    //#endregion Ajax requests

});